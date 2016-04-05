import {Injectable, OnDestroy} from "angular2/core";
import {WebGLContextService} from "./webgl-context";
import {FragmentShader} from "./fragment-shader";
import {VertexShader} from "./vertex-shader";

@Injectable()
export class WebGLProgramService implements OnDestroy {
    
    constructor(
        private context_: WebGLContextService,
        private fragShader_: FragmentShader,
        private vertShader_: VertexShader
    ) { };

    ngOnDestroy() {
        this.context_.get.deleteProgram(this.program_);
    };

    initWebGl() {
        let gl = this.context_.get;
        
        this.initProgram(gl);
        this.initBuffer(gl);
        gl.clearColor(0.0, 0.0, 1.0, 1.0);
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
            console.log("Unable to initialize the shader program.");
            gl.deleteProgram(this.program_);

            gl.deleteShader(vertShader);
            gl.deleteShader(fragShader);
        }

        gl.detachShader(this.program_, vertShader);
        gl.detachShader(this.program_, fragShader);

        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);

        gl.useProgram(this.program_);
        // TODO Add a "addAttribute" method.
        this.vertexPositionAttrib_ = gl.getAttribLocation(this.program_, "aVertexPosition");        
    };

    initBuffer(gl: WebGLRenderingContext) {
        this.squareVerticesBuffer_ = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer_);

        let vertices = [
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    };

    draw(width: number, height: number) {
        let gl = this.context_.get;

        gl.viewport(0, 0, width, height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enableVertexAttribArray(this.vertexPositionAttrib_);
        gl.vertexAttribPointer(this.vertexPositionAttrib_, 3, gl.FLOAT, false, 0, 0);

        let mvUniform = gl.getUniformLocation(this.program_, "uMVMatrix");
        
        // Reset to the identity matrix
        let mvMatrix = mat4.create()
        mat4.identity(mvMatrix);

        // mvMatrix will move model 6 units away from camera (camera looks in -z direction)
        mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(0.2, -0.2, -0.2));
        mat4.scale(mvMatrix, mvMatrix, vec3.fromValues(0.5, 0.5, 1.0));
        
        gl.uniformMatrix4fv(mvUniform, false, mvMatrix);

        // Add perspective view, near things appear larger
        let pUniform = gl.getUniformLocation(this.program_, "uPMatrix");

        let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
        let pMatrix = mat4.create();
        mat4.perspective(pMatrix, 60, aspect, 0.1, 100.0);

        gl.uniformMatrix4fv(pUniform, false, pMatrix);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    
    private program_: WebGLProgram;
    private squareVerticesBuffer_: WebGLBuffer;
    private vertexPositionAttrib_: number;
}