import { Subscription } from "rxjs/Subscription";
import { from as rxFrom } from "rxjs/observable/from";
import { zip as rxZip } from "rxjs/observable/zip";
import { map, mergeMap, tap } from "rxjs/operators";

import { Primitive } from "./primitive";
import { MaterialLoader } from "../materials/material-loader";
import { BufferLoader } from "../webgl2/buffer-loader";
import { ShaderProgram } from "../shaders/shader-program";
import { Transform, Mat4 } from "../game-engine/transform";

export class Mesh {
    private primitives_: Primitive[] = [];

    /**Only when all primitives have buffer and material loaded*/
    private can_draw_primitives_ = false;
    private mesh_creation_subscription: Subscription;

    private view_matrix_ = new Mat4();
    private inverse_view_matrix_ = new Mat4();
    private projection_matrix_ = new Mat4();
    private normal_matrix_ = new Mat4();

    constructor(private gl_context_: WebGL2RenderingContext,
        private gltf_data_: glTFData, private mesh_index_: number, private transform_: Transform,
        private material_loader_: MaterialLoader, private buffer_loader_: BufferLoader
    ) { };

    createMesh() {
        let primitives = this.gltf_data_.meshes[this.mesh_index_].primitives;
        this.mesh_creation_subscription = rxFrom(primitives)
            .pipe(
                map(primitive_data => {
                    return new Primitive(this.gl_context_, this.gltf_data_,
                        this.material_loader_, this.buffer_loader_, primitive_data);
                }),
                tap(primitive => this.primitives_.push(primitive)),
                mergeMap(primitive => {
                    return rxZip(
                        primitive.loadMaterial(),
                        primitive.loadVertexData()
                    )
                })
            )
            .subscribe(
                data => { console.log(data); },
                err => { console.log(err); },
                () => {
                    this.can_draw_primitives_ = true;
                }
            );
    };

    preMultiplyMatrices(view: Mat4, projection: Mat4) {
        this.transform_.updateTransform();

        // Update transformation matrices
        Mat4.multiply(view, this.transform_.transform, this.view_matrix_);
        Mat4.multiply(projection, this.view_matrix_, this.projection_matrix_);

        this.view_matrix_.inverse(this.inverse_view_matrix_);
        this.inverse_view_matrix_.transpose(this.normal_matrix_);
    };

    drawMesh(shader_program: ShaderProgram) {
        if (!this.can_draw_primitives_) return;

        // Transform Matrices:
        this.gl_context_.uniformMatrix4fv(shader_program.getUniform("u_view_matrix"), false, this.view_matrix_.array);
        this.gl_context_.uniformMatrix4fv(shader_program.getUniform("u_projection_matrix"), false, this.projection_matrix_.array);
        this.gl_context_.uniformMatrix3fv(shader_program.getUniform("u_normal_matrix"), false, this.normal_matrix_.mat3);

        this.primitives_.forEach(primitive => primitive.draw(shader_program));
    };
}