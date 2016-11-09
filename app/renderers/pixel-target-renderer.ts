import { Injectable, Inject } from "@angular/core";

import { ShaderProgram } from "../shaders/shader-program";
import { uniform_color_shader } from "../shaders/shader-program.module";
import { webgl2 } from "../canvas/webgl2-token";
import { RenderObject } from "./render-object";
import { Texture2d } from "../textures/texture-2d";
//import { cubes } from "../vertex-data/cubes";
import { MainCamera } from "../game-engine/main-camera";
import { InputManager } from "../game-engine/input-manager";
import { Vec2 } from "../game-engine/vec2";

@Injectable()
export class PixelTargetRenderer {

    private target_objects = new Map<string, RenderObject[]>();
    private framebuffer: WebGLFramebuffer;
    private depth_buffer: WebGLRenderbuffer;
    private rendered_texture: Texture2d;

    get width() { return this.width_; };
    get height() { return this.height_; };

    private width_ = 640;
    private height_ = 480;

    private current_target_: Vec2;

    constructor(
        @Inject(webgl2) private gl: WebGL2RenderingContext,
        @Inject(uniform_color_shader) private shader_program: ShaderProgram,
        //@Inject(cubes) cubes_array: RenderObject[],
        private input_manager_: InputManager
    ) {
        //this.target_objects.set(cubes.toString(), cubes_array);
        this.input_manager_.set_mouse_target.subscribe((target) => {
            this.current_target_ = target;
        })
    };

    createFramebuffer() {

        this.shader_program.initProgram();

        this.framebuffer = this.gl.createFramebuffer();

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);

        this.rendered_texture = new Texture2d(this.width_, this.height_, this.gl);
        this.rendered_texture.setTextureParameters("nearest", "nearest", false);
        this.rendered_texture.allocateTextureStorage();

        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.rendered_texture.id, 0);

        this.depth_buffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depth_buffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.width_, this.height_);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depth_buffer);
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);

        if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) != this.gl.FRAMEBUFFER_COMPLETE) {
            console.log("Frame buffer is not complete.");
        }

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    };

    getMouseTarget(canvas_width: number, canvas_height: number) {

        if (this.current_target_) {
            this.drawOffscreen();
            
            let offscreen_buffer_x = (this.current_target_.x / canvas_width) * this.width;
            let offscreen_buffer_y = this.height - ((this.current_target_.y / canvas_height ) * this.height);

            let color = new Float32Array(4);
            this.gl.readPixels(offscreen_buffer_x, offscreen_buffer_y, 1, 1, this.gl.RGBA, this.gl.FLOAT, color);

            console.log("colour picked: " + color);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.current_target_ = null;
            return color;
        }
    };

    // TODO: set unique identifying colors for each object.
    setUniqueColors() {
    };

    private drawOffscreen() {

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);

        this.gl.viewport(0, 0, this.width_, this.height_);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.shader_program.useProgram();

        //this.target_objects.forEach((array: RenderObject[], type: string) => {
        //    array[0].bindVertexArray();
        //    array.forEach((object) => {
        //        object.setUniforms(this.gl, this.shader_program);
        //        this.gl.drawArrays(this.gl.TRIANGLES, 0, object.vertex_count);
        //    });
        //    array[0].unbindVertexArray();
        //});
    };
};