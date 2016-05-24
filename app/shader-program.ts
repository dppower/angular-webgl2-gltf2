import {Injectable, provide, OpaqueToken} from "@angular/core";
import {RenderContext} from "./render-context";
import {ShaderType, compileShader} from "./shader";
import frag_diffuse from "./fragment-diffuse-lambert";
import vert_source from "./vertex-source";

@Injectable()
export class ShaderProgram {
    
    constructor(
        private context_: RenderContext,
        private vertSource_: string,
        private fragSource_: string
    ) { };

    dispose() {
        this.context_.get.deleteProgram(this.program_);
    };

    initWebGl() {
        let gl = this.context_.get;
        
        this.initProgram(gl);
        this.initVertexArrays(gl);
        gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    };

    initProgram(gl: WebGLRenderingContext) {
        let vertShader = compileShader(gl, ShaderType.Vertex, this.vertSource_);
        let fragShader = compileShader(gl, ShaderType.Fragment, this.fragSource_);

        this.program_ = gl.createProgram();
        gl.attachShader(this.program_, vertShader);
        gl.attachShader(this.program_, fragShader);
        gl.linkProgram(this.program_);

        if (!gl.getProgramParameter(this.program_, gl.LINK_STATUS)) {
            gl.deleteProgram(this.program_);

            gl.deleteShader(vertShader);
            gl.deleteShader(fragShader);

            alert("Unable to initialize the shader program."); 
        }

        gl.detachShader(this.program_, vertShader);
        gl.detachShader(this.program_, fragShader);

        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);

        gl.useProgram(this.program_);

        this.uView = gl.getUniformLocation(this.program_, "uView");
        this.uProjection = gl.getUniformLocation(this.program_, "uProjection");
        this.uModel = gl.getUniformLocation(this.program_, "uModel");
        this.uSampler = gl.getUniformLocation(this.program_, "uBaseTexture");               
    };

    initVertexArrays(gl: WebGLRenderingContext) {

        this.aVertexPosition = gl.getAttribLocation(this.program_, "aVertexPosition");
        this.aNormals = gl.getAttribLocation(this.program_, "aNormals");
        this.aTextureCoords = gl.getAttribLocation(this.program_, "aTextureCoords");
        
        gl.enableVertexAttribArray(this.aVertexPosition);
        gl.enableVertexAttribArray(this.aNormals);
        gl.enableVertexAttribArray(this.aTextureCoords);
    };

    aVertexPosition: number;
    aNormals: number;
    aTextureCoords: number;

    uView: WebGLUniformLocation;
    uProjection: WebGLUniformLocation;
    uModel: WebGLUniformLocation;
    uSampler: WebGLUniformLocation;

    private program_: WebGLProgram;
}

var shaderProgramFactory = (vert_source: string, frag_source: string) => {
    return (context: RenderContext) => {
        return new ShaderProgram(context, vert_source, frag_source)
    }
};

export const BASIC_SHADER = new OpaqueToken("basic-diffuse-shader");

export const SHADER_PROVIDERS = [provide(BASIC_SHADER, { useFactory: shaderProgramFactory(vert_source, frag_diffuse), deps: [RenderContext] })]