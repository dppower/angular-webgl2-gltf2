import {Injectable} from "@angular/core";
import {WebGLContextService} from "./webgl-context";
import {FragmentShader} from "./fragment-shader";
import {VertexShader} from "./vertex-shader";

@Injectable()
export class WebGLProgramService {
    
    constructor(
        private context_: WebGLContextService,
        private fragShader_: FragmentShader,
        private vertShader_: VertexShader
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
        let vertShader = this.vertShader_.getShader();
        let fragShader = this.fragShader_.getShader();

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
        this.uSampler = gl.getUniformLocation(this.program_, "uSampler");               
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