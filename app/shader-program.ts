import {Injectable, provide, OpaqueToken} from "@angular/core";
import {RenderContext} from "./render-context";
import {ShaderType, compileShader, ShaderSource} from "./shader";
import frag_diffuse from "./shaders/f-diffuse";
import vert_diffuse from "./shaders/v-diffuse";
import frag_skybox from "./shaders/f-skybox";
import vert_skybox from "./shaders/v-skybox";
import frag_basic from "./shaders/f-basic";
import vert_basic from "./shaders/v-basic";
import sky_quad_vs from "./shaders/sky-quad.vs";
import sky_quad_fs from "./shaders/sky-quad.fs";
import texture_2d_vs from "./shaders/texture-2d.vs";
import texture_cube_vs from "./shaders/texture-cube.vs";
import transmittance_fs from "./shaders/transmittance.fs";
import inscatter_fs from "./shaders/inscattering.fs";

@Injectable()
export class ActiveProgramAttributes {
    private active_attribute_count = 0;

    CheckAttributeCount(attribute_count: number, gl: WebGLRenderingContext) {
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

    private attribute_count_: number;
    private attributes_= new Map<string, number>();
    private uniforms_ = new Map<string, WebGLUniformLocation>();

    constructor(private context_: RenderContext, private vertSource_: ShaderSource, private fragSource_: ShaderSource, private active_attribute_counter_: ActiveProgramAttributes) { };

    dispose() {
        this.context_.get.deleteProgram(this.program_);
    };

    getAttribute(name: string): number {
        return this.attributes_.get(name);
    };

    getUniform(name: string): WebGLUniformLocation {
        return this.uniforms_.get(name);
    };

    initialise(gl: WebGLRenderingContext) {
        let vertShader = compileShader(gl, ShaderType.Vertex, this.vertSource_.source);
        let fragShader = compileShader(gl, ShaderType.Fragment, this.fragSource_.source);

        this.program_ = gl.createProgram();
        gl.attachShader(this.program_, vertShader);
        gl.attachShader(this.program_, fragShader);
        gl.linkProgram(this.program_);

        if (!gl.getProgramParameter(this.program_, gl.LINK_STATUS)) {
            console.log("Program link error: " + gl.getProgramInfoLog(this.program_));

            gl.deleteProgram(this.program_);

            gl.deleteShader(vertShader);
            gl.deleteShader(fragShader);

            alert("Unable to initialize the shader program."); 
        }

        gl.detachShader(this.program_, vertShader);
        gl.detachShader(this.program_, fragShader);

        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);

        this.initialiseVertexArrays(gl);
        this.locateUniforms(gl);
    };

    use(gl: WebGLRenderingContext) {
        this.context_.get.useProgram(this.program_);
        this.active_attribute_counter_.CheckAttributeCount(this.attribute_count_, gl);
    };

    locateUniforms(gl: WebGLRenderingContext) {
        this.vertSource_.uniforms.forEach((uniform_name) => {
            let uniform_location = gl.getUniformLocation(this.program_, uniform_name);
            this.uniforms_.set(uniform_name, uniform_location);
        });

        this.fragSource_.uniforms.forEach((uniform_name) => {
            let uniform_location = gl.getUniformLocation(this.program_, uniform_name);
            this.uniforms_.set(uniform_name, uniform_location);
        });
    };

    initialiseVertexArrays(gl: WebGLRenderingContext) {
        this.vertSource_.attributes.forEach((attribute_name) => {
            let attrib_location = gl.getAttribLocation(this.program_, attribute_name);
            this.attributes_.set(attribute_name, attrib_location);

            this.attribute_count_ = this.attributes_.size;
        });
    };

    private program_: WebGLProgram;
}

var shaderProgramFactory = (vert_source: ShaderSource, frag_source: ShaderSource) => {
    return (context: RenderContext, counter: ActiveProgramAttributes) => {
        return new ShaderProgram(context, vert_source, frag_source, counter);
    }
};

export const BASIC_SHADER = new OpaqueToken("basic-shader");
export const DIFFUSE_SHADER = new OpaqueToken("diffuse-shader");
export const SKYBOX_SHADER = new OpaqueToken("skybox-shader");
export const TRANSMITTANCE_SHADER = new OpaqueToken("transmittance-shader");
export const INSCATTER_SHADER = new OpaqueToken("inscatter-shader");
export const SKYQUAD_SHADER = new OpaqueToken("skyquad-shader");

export const SHADER_PROVIDERS = [
    ActiveProgramAttributes,
    provide(BASIC_SHADER, { useFactory: shaderProgramFactory(vert_basic, frag_basic), deps: [RenderContext, ActiveProgramAttributes] }),
    provide(DIFFUSE_SHADER, { useFactory: shaderProgramFactory(vert_diffuse, frag_diffuse), deps: [RenderContext, ActiveProgramAttributes] }),
    provide(SKYBOX_SHADER, { useFactory: shaderProgramFactory(vert_skybox, frag_skybox), deps: [RenderContext, ActiveProgramAttributes] }),
    provide(TRANSMITTANCE_SHADER, { useFactory: shaderProgramFactory(texture_2d_vs, transmittance_fs), deps: [RenderContext, ActiveProgramAttributes] }),
    provide(INSCATTER_SHADER, { useFactory: shaderProgramFactory(texture_cube_vs, inscatter_fs), deps: [RenderContext, ActiveProgramAttributes] }),
    provide(SKYQUAD_SHADER, { useFactory: shaderProgramFactory(sky_quad_vs, sky_quad_fs), deps: [RenderContext, ActiveProgramAttributes] })
]