import {Injectable, Inject} from "@angular/core";
import {RenderContext} from "./render-context";
import {BASIC_SHADER, ShaderProgram} from "./shader-program";
import {Cube, CUBES, CUBE_1, CUBE_2, CUBE_3} from "./cube";
import {Camera} from "./game-camera";

@Injectable()
export class PickingRenderer {

    private frameBuffer_: WebGLFramebuffer;
    private depthBuffer_: WebGLRenderbuffer;
    private texture_: WebGLTexture;

    get width() { return this.width_; };
    get height() { return this.height_; };

    private width_ = 640;
    private height_ = 480;

    constructor(
        private context_: RenderContext,
        @Inject(BASIC_SHADER) private program_: ShaderProgram,
        @Inject(CUBE_1) private cube1: Cube,
        @Inject(CUBE_2) private cube2: Cube,
        @Inject(CUBE_3) private cube3: Cube
    ) { };

    Start() {
        let gl = this.context_.get;

        this.program_.initialise(gl);

        this.frameBuffer_ = gl.createFramebuffer();

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer_);

        this.texture_ = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture_);
        // Set texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Allocate the texture data
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width_, this.height_, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture_, 0);

        this.depthBuffer_ = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer_);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width_, this.height_);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuffer_);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
            console.log("Frame buffer is not complete.");
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    GetMouseTarget(mouseX: number, mouseY: number) {
        let gl = this.context_.get;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer_);
        let colour = new Uint8Array(4);
        gl.readPixels(mouseX, mouseY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, colour);
        console.log("colour picked: " + colour); 
    };

    DrawOffscreen(camera: Camera) {
        let gl = this.context_.get;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer_);

        gl.viewport(0, 0, this.width_, this.height_);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.cube1.DrawBasic(this.program_, this.context_.get, camera);
        this.cube2.DrawBasic(this.program_, this.context_.get, camera);
        this.cube3.DrawBasic(this.program_, this.context_.get, camera);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
};