import {Injectable, provide, OpaqueToken} from "@angular/core";
import {RenderContext} from "./render-context";
import {ShaderType, compileShader, ShaderSource} from "./shader";
import frag_diffuse from "./shaders/f-diffuse";
import vert_diffuse from "./shaders/v-diffuse";
import frag_skybox from "./shaders/f-skybox";
import vert_skybox from "./shaders/v-skybox";

@Injectable()
export class ShaderProgram {

    private attributes_= new Map<string, number>();
    private uniforms_ = new Map<string, WebGLUniformLocation>();

    constructor(private context_: RenderContext, private vertSource_: ShaderSource, private fragSource_: ShaderSource) { };

    dispose() {
        this.context_.get.deleteProgram(this.program_);
    };

    getAttribute(name: string): number {
        return this.attributes_[name];
    };

    getUniform(name: string): WebGLUniformLocation {
        return this.uniforms_[name];
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

    use() {
        this.context_.get.useProgram(this.program_);
    };

    locateUniforms(gl: WebGLRenderingContext) {
        this.vertSource_.uniforms.forEach((uniform_name) => {
            this.uniforms_[uniform_name] = gl.getUniformLocation(this.program_, uniform_name);
        });
    };

    initialiseVertexArrays(gl: WebGLRenderingContext) {
        this.vertSource_.attributes.forEach((attribute_name) => {
            let attrib_location = gl.getAttribLocation(this.program_, attribute_name);
            this.attributes_[attribute_name] = attrib_location;
            gl.enableVertexAttribArray(attrib_location);
        });
    };

    private program_: WebGLProgram;
}

var shaderProgramFactory = (vert_source: ShaderSource, frag_source: ShaderSource) => {
    return (context: RenderContext) => {
        return new ShaderProgram(context, vert_source, frag_source)
    }
};

export const DIFFUSE_SHADER = new OpaqueToken("diffuse-shader");
export const SKYBOX_SHADER = new OpaqueToken("skybox-shader");

export const SHADER_PROVIDERS = [
    provide(DIFFUSE_SHADER, { useFactory: shaderProgramFactory(vert_diffuse, frag_diffuse), deps: [RenderContext] }),
    provide(SKYBOX_SHADER, { useFactory: shaderProgramFactory(vert_skybox, frag_skybox), deps: [RenderContext] })
]