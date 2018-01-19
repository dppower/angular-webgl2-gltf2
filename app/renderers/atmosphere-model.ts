//import { Injectable, Inject } from "@angular/core";

//import { ShaderProgram } from "../shaders/shader-program";
//import { inscatter_shader, transmittance_shader, skyquad_shader, inscatter_3d_shader} from "../shaders/shader-program.module";
//import { MainCamera } from "../game-engine/main-camera";
//import { Vec3, Quaternion } from "../game-engine/transform";
//import { webgl2 } from "../canvas/webgl2-token";
//import { Texture2d } from "../textures/texture-2d";

//const transmittance_width = 256;
//const transmittance_height = 256;
//const inscatter_width = 64;
//const inscatter_height = 64;
//const inscatter_depth = 64;

//// For solar noon at summer solstice:
//// const axial_tilt = 23.44;
//// const latitude = 52.18;
//const solar_noon_elevation = 61.26 * Math.PI / 180.0;
//const solar_noon_position = new Vec3(0, Math.sin(solar_noon_elevation), Math.cos(solar_noon_elevation));
//const axial_tilt = Math.PI - (solar_noon_elevation + Math.PI / 2.0);
//const rotation_axis = new Vec3(0, Math.sin(axial_tilt), -Math.cos(axial_tilt));

////enum FramebufferStatus {
////    FRAMEBUFFER_COMPLETE = 0x8CD5,
////    FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6,
////    FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7,
////    FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9,
////    FRAMEBUFFER_UNSUPPORTED = 0x8CDD
////};

//@Injectable()
//export class AtmosphereModel {

//    constructor(
//        @Inject(webgl2) private gl: WebGL2RenderingContext,
//        @Inject(inscatter_shader) private inscatter_shader_: ShaderProgram,
//        @Inject(transmittance_shader) private transmittance_shader_: ShaderProgram,
//        @Inject(skyquad_shader) private skyquad_shader_: ShaderProgram,
//        @Inject(inscatter_3d_shader) private inscatter_3d_shader_: ShaderProgram
//    ) { };

//    private quad_vertices_: WebGLBuffer;

//    private transmittance_framebuffer_: WebGLFramebuffer;
//    private transmittance_depth_buffer_: WebGLRenderbuffer;
//    private transmittance_texture_: Texture2d;

//    private inscatter_framebuffer: WebGLFramebuffer;
//    private inscatter_depth_buffer: WebGLRenderbuffer;
//    private inscatter_texture_: WebGLTexture;

//    private inscatter_3d_framebuffer: WebGLFramebuffer;
//    private inscatter_3d_depth_buffer: WebGLRenderbuffer;
//    private inscatter_3d_texture_: WebGLTexture;

//    preRenderTextures() {
//        this.inscatter_shader_.initProgram();
//        this.transmittance_shader_.initProgram();
//        this.skyquad_shader_.initProgram();
//        this.inscatter_3d_shader_.initProgram();

//        this.quad_vertices_ = this.gl.createBuffer();
//        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad_vertices_);
//        let vertices = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]);
//        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

//        // Set up Framebuffer
//        this.transmittance_framebuffer_ = this.gl.createFramebuffer();
//        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.transmittance_framebuffer_);

//        // Add the depth buffer
//        this.transmittance_depth_buffer_ = this.gl.createRenderbuffer();
//        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.transmittance_depth_buffer_);
//        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, transmittance_width, transmittance_height);
//        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.transmittance_depth_buffer_);
//        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);

//        // Transmittance texture 2d.
//        this.transmittance_texture_ = new Texture2d(this.gl);
//        //this.transmittance_texture_.setTextureParameters("linear", "linear", false);
//        this.transmittance_texture_.allocateTextureStorage(transmittance_width, transmittance_height);

//        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.transmittance_texture_.id, 0);

//        if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) != this.gl.FRAMEBUFFER_COMPLETE) {
//            alert("Sky model transmittance frame buffer is not complete.");
//        }

//        this.renderTransmittanceTexture();

//        this.gl.finish();

//        // Inscatter texture cube.
//        this.inscatter_texture_ = this.gl.createTexture();
//        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.inscatter_texture_);

//        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
//        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
//        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
//        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);       

//        for (let i = 0; i < 6; i++) {
//            this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl.RGBA, inscatter_width, inscatter_height, 0, this.gl.RGBA, this.gl.FLOAT, null);
//        }

//        this.inscatter_framebuffer = this.gl.createFramebuffer();
//        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.inscatter_framebuffer);

//        this.inscatter_depth_buffer = this.gl.createRenderbuffer();
//        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.inscatter_depth_buffer);
//        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, inscatter_width, inscatter_height);
//        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.inscatter_depth_buffer);
//        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);

//        for (let i = 0; i < 6; i++) {           
//            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.inscatter_texture_, 0);
//            if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) != this.gl.FRAMEBUFFER_COMPLETE) {
//                //let status_code = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
//                console.log(`Inscatter frame buffer ${i} is not complete.`);
//            }
//            else {
//                this.createInscatterTexture(i);
//            }
//        }

//        this.gl.finish();

//        // Inscatter 3d texture
//        this.inscatter_3d_texture_ = this.gl.createTexture();
//        this.gl.bindTexture(this.gl.TEXTURE_3D, this.inscatter_3d_texture_);

//        this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
//        this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
//        this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
//        this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
//        this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_WRAP_R, this.gl.CLAMP_TO_EDGE);

//        this.gl.texImage3D(this.gl.TEXTURE_3D, 0, this.gl.RGBA, inscatter_width, inscatter_height, inscatter_depth, 0, this.gl.RGBA, this.gl.FLOAT, null);

//        this.inscatter_3d_framebuffer = this.gl.createFramebuffer();
//        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.inscatter_3d_framebuffer);

//        for (let i = 0; i < inscatter_depth; i++) {
//            this.gl.framebufferTextureLayer(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.inscatter_3d_texture_, 0, i);
//            if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) != this.gl.FRAMEBUFFER_COMPLETE) {
//                console.log("Inscatter 3d frame buffer is not complete.");
//            }
//            else {
//                this.renderInscatterLayer(i);
//            }
//        }

//        this.gl.finish();

//        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
//    };

//    renderTransmittanceTexture() {
        
//        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
//        this.gl.viewport(0, 0, transmittance_width, transmittance_height);
//        this.transmittance_shader_.useProgram();

//        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad_vertices_);
//        this.gl.enableVertexAttribArray(0);
//        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);

//        // TODO Set up uniforms for model parameters rather than use constants

//        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
//    }

//    createInscatterTexture(cube_face: number) {
        
//        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
//        this.gl.viewport(0, 0, inscatter_width, inscatter_height);

//        this.inscatter_shader_.useProgram();

//        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad_vertices_);
//        this.gl.enableVertexAttribArray(0);
//        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);

//        this.gl.uniform1i(this.inscatter_shader_.getUniform("cube_face"), cube_face);
//        this.gl.uniform3fv(this.inscatter_shader_.getUniform("noon_position"), solar_noon_position.array);

//        this.gl.activeTexture(this.gl.TEXTURE0);
//        this.gl.bindTexture(this.gl.TEXTURE_2D, this.transmittance_texture_.id);
//        this.gl.uniform1i(this.inscatter_shader_.getUniform("transmittance_sampler"), 0);

//        // TODO Set up uniforms for model parameters rather than use constants

//        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
//    }

//    renderInscatterLayer(layer: number) {

//        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
//        this.gl.viewport(0, 0, inscatter_width, inscatter_height);

//        let rotation_angle = 180 * layer / (inscatter_depth - 1);
        
//        let q = Quaternion.fromAxisAngle(rotation_axis, rotation_angle);
//        let sun_direction = q.rotate(solar_noon_position);

//        //console.log(`layer: ${layer}, angle: ${rotation_angle}, sun direction: ${sun_direction.toString()}.`);

//        this.inscatter_3d_shader_.useProgram();

//        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad_vertices_);
//        this.gl.enableVertexAttribArray(0);
//        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);

//        this.gl.activeTexture(this.gl.TEXTURE0);
//        this.gl.bindTexture(this.gl.TEXTURE_2D, this.transmittance_texture_.id);
//        this.gl.uniform1i(this.inscatter_3d_shader_.getUniform("transmittance_sampler"), 0);

//        this.gl.uniform1f(this.inscatter_3d_shader_.getUniform("layer"), layer / (inscatter_depth - 1));
//        this.gl.uniform3fv(this.inscatter_3d_shader_.getUniform("sun_direction"), sun_direction.array);

//        //// TODO Set up uniforms for model parameters rather than use constants

//        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
//    };

//    renderSky(camera: MainCamera) {
//        this.skyquad_shader_.useProgram();

//        this.gl.depthMask(false);
//        this.gl.activeTexture(this.gl.TEXTURE0);
//        //this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.inscatter_texture_);
//        this.gl.bindTexture(this.gl.TEXTURE_3D, this.inscatter_3d_texture_);

//        //this.transmittance_texture_.bindTexture();

//        this.gl.uniform1i(this.skyquad_shader_.getUniform("inscatter_3d_sampler"), 0);
//        this.gl.uniform1f(this.skyquad_shader_.getUniform("layer"), 0.5);
//        //this.gl.uniform1i(this.skyquad_shader_.getUniform("transmittance_sampler"), 0);

//        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad_vertices_);
//        this.gl.enableVertexAttribArray(0);
//        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
        
//        this.gl.uniformMatrix4fv(this.skyquad_shader_.getUniform("inverse_view"), false, camera.inverse_view.array);
//        this.gl.uniformMatrix4fv(this.skyquad_shader_.getUniform("inverse_projection"), false, camera.inverse_projection.array);

//        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

//        this.gl.depthMask(true);
//    }
//}