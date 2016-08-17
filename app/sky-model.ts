import {Injectable, Inject} from "@angular/core";
import {ShaderProgram, INSCATTER_SHADER, TRANSMITTANCE_SHADER, SKYQUAD_SHADER} from "./shader-program";
import {Camera} from "./game-camera";
import {Vec3} from "./vec3";

const TRANSMITTANCE_RESOLUTION = { width: 256, height: 256 };
const INSCATTER_RESOLUTION = 256;


// For solar noon at summer solstice:
const sun_angle = 14.3828;
const noon_position = new Vec3(0, Math.sin(sun_angle), Math.cos(sun_angle));
// axis of rotaion
const axial_tilt = 23.4371;
const latitude = 52.1801;
const rotation_axis = new Vec3(0, -Math.sin(latitude), Math.cos(latitude));

enum FramebufferStatus {
    FRAMEBUFFER_COMPLETE = 0x8CD5,
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6,
    FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7,
    FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9,
    FRAMEBUFFER_UNSUPPORTED = 0x8CDD
};

@Injectable()
export class AtmosphereModel {

    constructor(
        @Inject(INSCATTER_SHADER) private inscatterProgram_: ShaderProgram,
        @Inject(TRANSMITTANCE_SHADER) private transmittanceProgram_: ShaderProgram,
        @Inject(SKYQUAD_SHADER) private skyquadProgram_: ShaderProgram,
        private camera_: Camera
    ) { };

    private transmittanceFrameBuffer_: WebGLFramebuffer;
    private inscatterFrameBuffers_: WebGLFramebuffer[] = [];
    private inscatterFrameBuffer_: WebGLFramebuffer;
    private transmittancedepthBuffer_: WebGLRenderbuffer;
    private inscatterDepthBuffers_: WebGLRenderbuffer[] = [];
    private vertices_: WebGLBuffer;
    private inscatterTexture_: WebGLTexture;
    private transmittanceTexture_: WebGLTexture;

    start(gl: WebGLRenderingContext) {

        this.inscatterProgram_.initialise(gl);
        this.transmittanceProgram_.initialise(gl);
        this.skyquadProgram_.initialise(gl);

        this.vertices_ = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_);
        let vertices = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Set up Framebuffer
        this.transmittanceFrameBuffer_ = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.transmittanceFrameBuffer_);

        // Add the depth buffer
        this.transmittancedepthBuffer_ = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.transmittancedepthBuffer_);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, TRANSMITTANCE_RESOLUTION.width, TRANSMITTANCE_RESOLUTION.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.transmittancedepthBuffer_);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        // Transmittance texture 2d.
        this.transmittanceTexture_ = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.transmittanceTexture_);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TRANSMITTANCE_RESOLUTION.width, TRANSMITTANCE_RESOLUTION.height, 0, gl.RGBA, gl.FLOAT, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.transmittanceTexture_, 0);

        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
            alert("Sky model transmittance frame buffer is not complete.");
        }

        this.createTransmittanceTexture(gl);

        gl.finish();

        //this.inscatterTexture_ = gl.createTexture();
        //gl.bindTexture(gl.TEXTURE_2D, this.inscatterTexture_);

        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, INSCATTER_RESOLUTION, INSCATTER_RESOLUTION, 0, gl.RGBA, gl.FLOAT, null);

        //this.inscatterFrameBuffer_ = gl.createFramebuffer();
        //gl.bindFramebuffer(gl.FRAMEBUFFER, this.inscatterFrameBuffer_);
        //gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.inscatterTexture_, 0);

        //if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
        //    alert("Sky model transmittance frame buffer is not complete.");
        //}

        //this.CreateInscatterTexture(gl, 4);

        // Inscatter texture cube.
        this.inscatterTexture_ = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.inscatterTexture_);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);       

        for (let i = 0; i < 6; i++) {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, INSCATTER_RESOLUTION, INSCATTER_RESOLUTION, 0, gl.RGBA, gl.FLOAT, null);
        }

        for (let i = 0; i < 6; i++) {
            this.inscatterFrameBuffers_[i] = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.inscatterFrameBuffers_[i]);

            //this.inscatterDepthBuffers_[i] = gl.createRenderbuffer();
            //gl.bindRenderbuffer(gl.RENDERBUFFER, this.inscatterDepthBuffers_[i]);
            //gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, INSCATTER_RESOLUTION, INSCATTER_RESOLUTION);
            //gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.inscatterDepthBuffers_[i]);
            //gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.inscatterTexture_, 0);

            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
                let status_code = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
                console.log("Inscatter frame buffer, " + i + ", is not complete: " + FramebufferStatus[status_code]);
            }

            this.createInscatterTexture(gl, i);
        }

        gl.finish();

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    createTransmittanceTexture(gl: WebGLRenderingContext) {
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, TRANSMITTANCE_RESOLUTION.width, TRANSMITTANCE_RESOLUTION.height);
        this.transmittanceProgram_.use(gl);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_);
        gl.vertexAttribPointer(this.transmittanceProgram_.getAttribute("a_vertex_position"), 2, gl.FLOAT, false, 0, 0);

        // TODO Set up uniforms for model parameters rather than use constants

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    createInscatterTexture(gl: WebGLRenderingContext, cubeFace: number) {
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, INSCATTER_RESOLUTION, INSCATTER_RESOLUTION);
        this.inscatterProgram_.use(gl);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_);
        gl.vertexAttribPointer(this.inscatterProgram_.getAttribute("a_vertex_position"), 2, gl.FLOAT, false, 0, 0);

        gl.uniform1i(this.inscatterProgram_.getUniform("u_cube_face"), cubeFace);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.transmittanceTexture_);
        gl.uniform1i(this.inscatterProgram_.getUniform("u_transmittance_sampler"), 0);

        // TODO Set up uniforms for model parameters rather than use constants

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    renderSky(gl: WebGLRenderingContext) {
        this.skyquadProgram_.use(gl);

        gl.depthMask(false);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.inscatterTexture_);
        //gl.bindTexture(gl.TEXTURE_2D, this.inscatterTexture_);
        //gl.bindTexture(gl.TEXTURE_2D, this.transmittanceTexture_);
        gl.uniform1i(this.skyquadProgram_.getUniform("u_inscatter_sampler"), 0);
        //gl.uniform1i(this.skyquadProgram_.getUniform("u_transmittance_sampler"), 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_);
        gl.vertexAttribPointer(this.skyquadProgram_.getAttribute("a_vertex_position"), 2, gl.FLOAT, false, 0, 0);

        //gl.uniformMatrix4fv(this.skyquadProgram_.getUniform("u_inverse_view"), false, this.camera_.inverseView);

        //gl.uniformMatrix4fv(this.skyquadProgram_.getUniform("u_inverse_projection"), false, this.camera_.inverseProjection);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.depthMask(true);
    }
}