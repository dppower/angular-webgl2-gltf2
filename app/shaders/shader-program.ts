import { Inject, Injectable, Injector, OpaqueToken } from "@angular/core";

import { webgl2 } from "../canvas/render-context";
import { ShaderType, compileShader, VertexShaderSource, FragmentShaderSource } from "./shader";

import diffuse_uniform_color_fs from "./diffuse-uniform-color.fs";
import diffuse_uniform_color_vs from "./diffuse-uniform-color.vs";
import uniform_color_fs from "./uniform-color.fs";
import uniform_color_vs from "./uniform-color.vs";
import diffuse_oren_nayar_fs from "./diffuse-oren-nayar.fs";
import pbr_ggx_fs from "./pbr-ggx.fs";
import sky_quad_vs from "./sky-quad.vs";
import sky_quad_fs from "./sky-quad.fs";
import texture_2d_vs from "./texture-2d.vs";
import texture_cube_vs from "./texture-cube.vs";
import transmittance_fs from "./transmittance.fs";
import inscatter_fs from "./inscattering.fs";
import inscatter_3d_fs from "./inscattering-3d.fs";
import per_vertex_fs from "./per-vertex-color.fs";
import per_vertex_vs from "./per-vertex-color.vs";


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

export enum AttributeLayout {
    vertex_position,
    vertex_normal,
    vertex_color,
    texture_coordinates
};

@Injectable()
export class ShaderProgram {

    get attribute_count() { return this.attribute_count_; };

    get uniform_map() { return this.uniforms_; };

    private attribute_count_: number;
    private attributes_= new Map<string, number>();
    private uniforms_ = new Map<string, WebGLUniformLocation>();
    private program_: WebGLProgram;

    constructor(
        @Inject(webgl2) private gl: WebGL2RenderingContext,
        private vertex_shader_source: VertexShaderSource,
        private fragment_shader_source: FragmentShaderSource
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

    useProgram() {
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

    private setAttributeCount() {
        
        this.attribute_count_ = this.vertex_shader_source.attributes.length;
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
    return (injector: Injector) => {
        let gl = injector.get(webgl2);
        let shader_program = new ShaderProgram(gl, vertex_source, fragment_source);
        return shader_program;
    }
};

export const diffuse_uniform_shader = new OpaqueToken("diffuse-uniform-color-shader");
export const diffuse_oren_nayar_shader = new OpaqueToken("diffuse-oren-nayar-shader");
export const uniform_color_shader = new OpaqueToken("uniform-color-shader");
export const pbr_ggx_shader = new OpaqueToken("pbr-ggx-shader");
export const transmittance_shader = new OpaqueToken("transmittance-shader");
export const inscatter_shader = new OpaqueToken("inscatter-shader");
export const inscatter_3d_shader = new OpaqueToken("inscatter-3d-shader");
export const skyquad_shader = new OpaqueToken("skyquad-shader");
export const per_vertex_color_shader = new OpaqueToken("per-vertex-color-shader");

export const shader_providers = [
    { provide: uniform_color_shader, useFactory: shader_program_factory(uniform_color_vs, uniform_color_fs), deps: [Injector, webgl2] },
    { provide: diffuse_uniform_shader, useFactory: shader_program_factory(diffuse_uniform_color_vs, diffuse_uniform_color_fs), deps: [Injector, webgl2] },
    { provide: diffuse_oren_nayar_shader, useFactory: shader_program_factory(diffuse_uniform_color_vs, diffuse_oren_nayar_fs), deps: [Injector, webgl2] },
    { provide: pbr_ggx_shader, useFactory: shader_program_factory(diffuse_uniform_color_vs, pbr_ggx_fs), deps: [Injector, webgl2] },     
    { provide: transmittance_shader, useFactory: shader_program_factory(texture_2d_vs, transmittance_fs), deps: [Injector, webgl2] },
    { provide: inscatter_shader, useFactory: shader_program_factory(texture_cube_vs, inscatter_fs), deps: [Injector, webgl2] },
    { provide: inscatter_3d_shader, useFactory: shader_program_factory(texture_2d_vs, inscatter_3d_fs), deps: [Injector, webgl2] },
    { provide: skyquad_shader, useFactory: shader_program_factory(sky_quad_vs, sky_quad_fs), deps: [Injector, webgl2] },
    { provide: per_vertex_color_shader, useFactory: shader_program_factory(per_vertex_vs, per_vertex_fs), deps: [Injector, webgl2] }
]