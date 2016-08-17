import { Inject, Injectable, Injector, provide, OpaqueToken } from "@angular/core";

import { webgl2_context } from "./render-context";
import { ShaderType, compileShader, VertexShaderSource, FragmentShaderSource } from "./shader";

import diffuse_uniform_color_fs from "./shaders/diffuse-uniform-color.fs";
import diffuse_uniform_color_vs from "./shaders/diffuse-uniform-color.vs";

import uniform_color_fs from "./shaders/uniform-color.fs";
import uniform_color_vs from "./shaders/uniform-color.vs";

//import sky_quad_vs from "./shaders/sky-quad.vs";
//import sky_quad_fs from "./shaders/sky-quad.fs";
//import texture_2d_vs from "./shaders/texture-2d.vs";
//import texture_cube_vs from "./shaders/texture-cube.vs";
//import transmittance_fs from "./shaders/transmittance.fs";
//import inscatter_fs from "./shaders/inscattering.fs";


// This is required when VertexArrayObjects are not available.
class ActiveProgramAttributes {
    private active_attribute_count = 0;

    checkAttributeCount(attribute_count: number, gl: WebGLRenderingContext) {
        let actives_difference = attribute_count - this.active_attribute_count;

        if (actives_difference > 0) {
            for (let i = 0; i < actives_difference; i++) {
                gl.enableVertexAttribArray(this.active_attribute_count + i);
            }
        }
        else if (actives_difference < 0) {
            for (let i = 0; i > actives_difference; i--) {
                gl.disableVertexAttribArray(this.active_attribute_count - 1 + i);
            }
        }
        this.active_attribute_count = attribute_count;
    };
}

@Injectable()
export class ShaderProgram {

    get attribute_count() { return this.attribute_count_; };

    private attribute_count_: number;
    private attributes_= new Map<string, number>();
    private uniforms_ = new Map<string, WebGLUniformLocation>();
    private program_: WebGLProgram;

    constructor(
        @Inject(webgl2_context) private gl: WebGL2RenderingContext,
        private vertex_shader_source: VertexShaderSource,
        private fragment_shader_source: FragmentShaderSource,
        private active_attribute_counter: ActiveProgramAttributes
    ) { };

    deleteProgram() {
        this.gl.deleteProgram(this.program_);
    };

    getAttribute(name: string): number {
        return this.attributes_.get(name);
    };

    getUniform(name: string): WebGLUniformLocation {
        return this.uniforms_.get(name);
    };

    initProgram() {
        let compiled_vertex_shader = compileShader(this.gl, ShaderType.Vertex, this.vertex_shader_source.source);
        let fragShader = compileShader(this.gl, ShaderType.Fragment, this.fragment_shader_source.source);

        this.program_ = this.gl.createProgram();
        this.gl.attachShader(this.program_, compiled_vertex_shader);
        this.gl.attachShader(this.program_, fragShader);
        this.gl.linkProgram(this.program_);

        if (!this.gl.getProgramParameter(this.program_, this.gl.LINK_STATUS)) {
            console.log("Program link error: " + this.gl.getProgramInfoLog(this.program_));

            this.gl.deleteProgram(this.program_);

            this.gl.deleteShader(compiled_vertex_shader);
            this.gl.deleteShader(fragShader);

            alert("Unable to initialize the shader program."); 
        }

        this.gl.detachShader(this.program_, compiled_vertex_shader);
        this.gl.detachShader(this.program_, fragShader);

        this.gl.deleteShader(compiled_vertex_shader);
        this.gl.deleteShader(fragShader);

        this.setAttributeIds(this.gl);
        this.locateUniforms(this.gl);
    };

    useProgram(gl: WebGLRenderingContext) {
        this.gl.useProgram(this.program_);
        //this.active_attribute_counter.checkAttributeCount(this.attribute_count_, this.gl);
    };

    private locateUniforms(gl: WebGLRenderingContext) {
        this.vertex_shader_source.uniforms.forEach((uniform_name) => {
            let uniform_location = this.gl.getUniformLocation(this.program_, uniform_name);
            this.uniforms_.set(uniform_name, uniform_location);
        });

        this.fragment_shader_source.uniforms.forEach((uniform_name) => {
            let uniform_location = this.gl.getUniformLocation(this.program_, uniform_name);
            this.uniforms_.set(uniform_name, uniform_location);
        });
    };

    private setAttributeIds(gl: WebGLRenderingContext) {
        this.vertex_shader_source.attributes.forEach((attribute_name) => {
            let attrib_id = this.gl.getAttribLocation(this.program_, attribute_name);
            this.attributes_.set(attribute_name, attrib_id);

            this.attribute_count_ = this.attributes_.size;
        });
    };
}

let shader_program_factory = (vertex_source: VertexShaderSource, fragment_source: FragmentShaderSource) => {
    return (injector: Injector, counter: ActiveProgramAttributes) => {
        let gl = injector.get(webgl2_context);
        return new ShaderProgram(gl, vertex_source, fragment_source, counter);
    }
};

export const diffuse_uniform_shader = new OpaqueToken("diffuse-uniform-color-shader");
export const uniform_color_shader = new OpaqueToken("diffuse-uniform-color-shader");
//export const SKYBOX_SHADER = new OpaqueToken("skybox-shader");
//export const TRANSMITTANCE_SHADER = new OpaqueToken("transmittance-shader");
//export const INSCATTER_SHADER = new OpaqueToken("inscatter-shader");
//export const SKYQUAD_SHADER = new OpaqueToken("skyquad-shader");

export const shader_providers = [
    ActiveProgramAttributes,
    provide(uniform_color_shader, { useFactory: shader_program_factory(uniform_color_vs, uniform_color_fs), deps: [Injector, webgl2_context, ActiveProgramAttributes] }),
    provide(diffuse_uniform_shader, { useFactory: shader_program_factory(uniform_color_vs, diffuse_uniform_color_fs), deps: [Injector, webgl2_context, ActiveProgramAttributes] }),
    //provide(SKYBOX_SHADER, { useFactory: shaderProgramFactory(vert_skybox, frag_skybox), deps: [RenderContext, ActiveProgramAttributes] }),
    //provide(TRANSMITTANCE_SHADER, { useFactory: shaderProgramFactory(texture_2d_vs, transmittance_fs), deps: [RenderContext, ActiveProgramAttributes] }),
    //provide(INSCATTER_SHADER, { useFactory: shaderProgramFactory(texture_cube_vs, inscatter_fs), deps: [RenderContext, ActiveProgramAttributes] }),
    //provide(SKYQUAD_SHADER, { useFactory: shaderProgramFactory(sky_quad_vs, sky_quad_fs), deps: [RenderContext, ActiveProgramAttributes] })
]