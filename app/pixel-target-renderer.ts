import { Injectable, Inject } from "@angular/core";

import { uniform_color_shader, ShaderProgram } from "./shader-program";
import { webgl2_context } from "./render-context";
import { Texture2d } from "./texture-2d";
import { Cube, CUBES, CUBE_1, CUBE_2, CUBE_3 } from "./cube";
import { Camera } from "./game-camera";

@Injectable()
export class PixelTargetRenderer {

    private framebuffer_: WebGLFramebuffer;
    private depthbuffer_: WebGLRenderbuffer;
    private texture_: Texture2d;

    get width() { return this.width_; };
    get height() { return this.height_; };

    private width_ = 640;
    private height_ = 480;

    constructor(
        @Inject(webgl2_context) private gl: WebGL2RenderingContext,
        @Inject(uniform_color_shader) private shader_program: ShaderProgram
        //@Inject(CUBE_1) private cube1: Cube,
        //@Inject(CUBE_2) private cube2: Cube,
        //@Inject(CUBE_3) private cube3: Cube
    ) { };

    createFramebuffer() {

        this.shader_program.initProgram();

        this.framebuffer = this.gl.createFramebuffer();

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);

        this.picking_texture = new Texture2d(this.width_, this.height_, this.gl);
        this.picking_texture.setTextureParameters("nearest", "nearest", false);

        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.picking_texture.texture, 0);

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

    getMouseTarget(mouse_x: number, mouse_y: number) {
        
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer_);
        let color = new Uint8Array(4);
        this.gl.readPixels(mouse_x, mouse_y, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, color);
        console.log("colour picked: " + color);
        return color 
    };
    
    DrawBasic(program: ShaderProgram, gl: WebGLRenderingContext, camera: Camera) {

        if (!this.textureLoaded_) return;

        program.use(gl);

        // Attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_);
        gl.vertexAttribPointer(program.getAttribute("aVertexPosition"), 3, gl.FLOAT, false, 0, 0);

        // Uniforms
        gl.uniformMatrix4fv(program.getUniform("view"), false, camera.view);
        gl.uniformMatrix4fv(program.getUniform("projection"), false, camera.projection);
        gl.uniformMatrix4fv(program.getUniform("transform"), false, this.transform_.transform.array);
        gl.uniform4fv(program.getUniform("uniform_colour"), this.colour_);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    };

    drawOffscreen(camera: Camera) {

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

        gl.viewport(0, 0, this.width_, this.height_);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.cube1.DrawBasic(this.program_, this.context_.get, camera);
        this.cube2.DrawBasic(this.program_, this.context_.get, camera);
        this.cube3.DrawBasic(this.program_, this.context_.get, camera);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
};