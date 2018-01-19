import { Subscription } from "rxjs/Subscription";
import { from as rxFrom } from "rxjs/observable/from";
import { zip as rxZip } from "rxjs/observable/zip";
import { map, mergeMap, tap } from "rxjs/operators";

import { Primitive } from "./primitive";
import { MaterialLoader } from "../materials/material-loader";
import { BufferLoader } from "../webgl2/buffer-loader";
import { ShaderProgram } from "../shaders/shader-program";
import { Transform } from "../game-engine/transform";

export class Mesh {
    private primitives_: Primitive[];

    /**Only when all primitives have buffer and material loaded*/
    private can_draw_primitives_ = false;
    private mesh_creation_subscription: Subscription;

    constructor(private gl_context_: WebGL2RenderingContext,
        private gltf_data_: glTF, private mesh_index_: number, private transform_: Transform,
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
                data => { },
                err => { },
                () => {
                    this.can_draw_primitives_ = true;
                }
            );
    }

    drawMesh(shader_program: ShaderProgram) {
        if (!this.can_draw_primitives_) return;
        //draw all primitives for this mesh
    }
}