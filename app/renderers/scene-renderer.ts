import { Injectable, Inject, OpaqueToken } from "@angular/core";

import { RenderObject } from "../render-objects/render-object";
import { ShaderProgram } from "../shaders/shader-program";
import { diffuse_uniform_shader, diffuse_oren_nayar_shader, pbr_ggx_shader, per_vertex_color_shader, diffuse_texture_shader } from "../shaders/shader-program.module";
import { webgl2, static_objects } from "../canvas/webgl2-token";
import { MainCamera } from "../game-engine/main-camera";
import { Vec3, Mat4 } from "../game-engine/transform";

import { ObjectBuffer } from "../render-objects/object-buffer";

@Injectable()
export class SceneRenderer {

    private scene_objects = new Map<OpaqueToken, RenderObject[]>();
    private light_direction = new Vec3(0.4, 0.4, 1.0);
    private current_direction = new Vec3();

    constructor(
        @Inject(webgl2) private gl: WebGL2RenderingContext,
        @Inject(diffuse_uniform_shader) private diffuse_uniform_shader_: ShaderProgram,
        @Inject(diffuse_texture_shader) private diffuse_texture_shader_: ShaderProgram,
        @Inject(diffuse_oren_nayar_shader) private diffuse_oren_nayar_shader_: ShaderProgram,
        @Inject(pbr_ggx_shader) private pbr_ggx_shader_: ShaderProgram,
        @Inject(per_vertex_color_shader) private per_vertex_shader_: ShaderProgram,
        @Inject(static_objects) private static_objects: RenderObject[]
    ) { };

    start() {
        this.diffuse_uniform_shader_.initProgram();
        this.diffuse_texture_shader_.initProgram();
        this.diffuse_oren_nayar_shader_.initProgram();
        this.pbr_ggx_shader_.initProgram();
        this.per_vertex_shader_.initProgram();

        // Sort RenderObjects
        this.static_objects.forEach(render_object => {
            let buffer_id = render_object.buffer_id;
            if (!this.scene_objects.get(buffer_id)) {
                this.scene_objects.set(buffer_id, [render_object]);
            }
            else {
                this.scene_objects.get(buffer_id).push(render_object);
            }
        })
    };

    updateScene(dt: number, camera: MainCamera) {

        let view = camera.view.array;

        this.current_direction.x = view[0] * this.light_direction.x + view[4] * this.light_direction.y + view[8] * this.light_direction.z;
        this.current_direction.y = view[1] * this.light_direction.x + view[5] * this.light_direction.y + view[9] * this.light_direction.z;
        this.current_direction.z = view[2] * this.light_direction.x + view[6] * this.light_direction.y + view[10] * this.light_direction.z;

        this.scene_objects.forEach(object_array => {
            object_array.forEach(object => {
                object.update(camera.view, camera.projection);
            });
        });
    };


    drawObjects() {
        this.scene_objects.forEach((array: RenderObject[], type: OpaqueToken) => {
            if (array[0].id == "cube_low") {
                this.pbr_ggx_shader_.useProgram();
                this.gl.uniform3fv(this.pbr_ggx_shader_.getUniform("light_direction"), this.current_direction.array);
                array[0].beginDraw();
                array.forEach((object) => {
                    object.drawObject(this.pbr_ggx_shader_);
                });
                array[0].finishDraw();
            }
            else {
                this.diffuse_uniform_shader_.useProgram();
                this.gl.uniform3fv(this.diffuse_uniform_shader_.getUniform("light_direction"), this.current_direction.array);
                array[0].beginDraw();
                array.forEach((object) => {
                    object.drawObject(this.diffuse_uniform_shader_);
                });
                array[0].finishDraw();
            }
        });
    };
}