import { Injectable, Inject, OpaqueToken } from "@angular/core";

//import { cubes } from "../vertex-data/cubes";
import { RenderObject } from "./render-object";
import { ShaderProgram } from "../shaders/shader-program";
import { diffuse_uniform_shader, diffuse_oren_nayar_shader, pbr_ggx_shader, per_vertex_color_shader } from "../shaders/shader-program.module";
import { webgl2, buffer_dictionary, scene_provider_token } from "../canvas/webgl2-token";
import { MainCamera } from "../game-engine/main-camera";
import { Vec3, Mat4 } from "../game-engine/transform";

import { ObjectBuffer } from "../vertex-data/object-buffer";

@Injectable()
export class SceneRenderer {

    //private scene_objects = new Map<string, RenderObject[]>();
    private light_direction = new Vec3(0.4, 0.4, 1.0);
    private current_direction = new Vec3();

    constructor(
        @Inject(webgl2) private gl: WebGL2RenderingContext,
        @Inject(diffuse_uniform_shader) private diffuse_uniform_shader_: ShaderProgram,
        @Inject(diffuse_oren_nayar_shader) private diffuse_oren_nayar_shader_: ShaderProgram,
        @Inject(pbr_ggx_shader) private pbr_ggx_shader_: ShaderProgram,
        @Inject(per_vertex_color_shader) private per_vertex_shader_: ShaderProgram,
        @Inject(scene_provider_token) private scene_objects: Map<OpaqueToken, RenderObject[]>,
        @Inject(buffer_dictionary) private buffers: Map<OpaqueToken, ObjectBuffer>
    ) {

        //this.scene_objects.set("cubes", cubes_array);
    };

    start() {
        this.diffuse_uniform_shader_.initProgram();
        this.diffuse_oren_nayar_shader_.initProgram();
        this.pbr_ggx_shader_.initProgram();
        this.per_vertex_shader_.initProgram();

        //this.scene_objects.get("cubes")[0].uniform_color = new Float32Array([1.0, 0.0, 0.0, 1.0]);
        //this.scene_objects.get("cubes")[1].uniform_color = new Float32Array([0.0, 1.0, 0.0, 1.0]);
        //this.scene_objects.get("cubes")[2].uniform_color = new Float32Array([0.0, 0.0, 1.0, 1.0]);

        //this.scene_objects.get("cubes")[0].roughness = 0.9;
        //this.scene_objects.get("cubes")[1].roughness = 0.5;
        //this.scene_objects.get("cubes")[2].roughness = 0.1;

        //this.scene_objects.get("cubes")[0].metallic = 0.0;
        //this.scene_objects.get("cubes")[1].metallic = 0.0;
        //this.scene_objects.get("cubes")[2].metallic = 0.0;

    };

    updateScene(dt: number, camera: MainCamera) {

        let view = camera.view.array;

        this.current_direction.x = view[0] * this.light_direction.x + view[4] * this.light_direction.y + view[8] * this.light_direction.z;
        this.current_direction.y = view[1] * this.light_direction.x + view[5] * this.light_direction.y + view[9] * this.light_direction.z;
        this.current_direction.z = view[2] * this.light_direction.x + view[6] * this.light_direction.y + view[10] * this.light_direction.z;

        this.scene_objects.forEach(object_array => {
            object_array.forEach(object => {
                console.log(`object name: ${object.id}, position: ${object.position.toString()}`);
                object.update(camera.view, camera.projection);
            });
        });
    };


    drawObjects() {

        this.diffuse_uniform_shader_.useProgram();
        //this.diffuse_oren_nayar_shader_.useProgram();
        //this.pbr_ggx_shader_.useProgram();
        //this.per_vertex_shader_.useProgram();
        this.gl.uniform3fv(this.diffuse_uniform_shader_.getUniform("light_direction"), this.current_direction.array);
        //this.gl.uniform3fv(this.diffuse_oren_nayar_shader_.getUniform("light_direction"), updated_direction.array);
        //this.gl.uniform3fv(this.pbr_ggx_shader_.getUniform("light_direction"), this.current_direction.array);

        this.scene_objects.forEach((array: RenderObject[], type: OpaqueToken) => {

            let buffer = this.buffers.get(type);
            buffer.bindVertexArray();
            array.forEach((object) => {
                object.setUniforms(this.gl, this.diffuse_uniform_shader_);
                this.gl.drawArrays(this.gl.TRIANGLES, 0, buffer.vertex_count);
            });
            buffer.unbindVertexArray();
        });
    };
}