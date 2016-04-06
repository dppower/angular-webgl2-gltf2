import {Injectable} from "angular2/core";

@Injectable()
export class GameObject {
    constructor() { };

    cubeVerticesBuffer_: WebGLBuffer;
    cubeColorsBuffer_: WebGLBuffer;
    cubeIndexBuffer_: WebGLBuffer;

    get mMatrix() {
        mat4.identity(this.mMatrix_);
        mat4.translate(this.mMatrix_, this.mMatrix_, vec3.fromValues(0.0, 0.0, -6.0));
        mat4.rotateY(this.mMatrix_, this.mMatrix_, this.getAngle());
        return this.mMatrix_;
    };

    initBuffers(gl: WebGLRenderingContext) {
        this.cubeVerticesBuffer_ = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVerticesBuffer_);

        let cubeVertices = [
            -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
            -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
            -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
            1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
            -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

        this.cubeColorsBuffer_ = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeColorsBuffer_);

        let colors = [
            1.0, 0.0, 0.6, 1.0, 1.0, 0.0, 0.6, 1.0, 1.0, 0.0, 0.6, 1.0, 1.0, 0.0, 0.6, 1.0,
            0.1, 0.8, 0.7, 1.0, 0.1, 0.8, 0.7, 1.0, 0.1, 0.8, 0.7, 1.0, 0.1, 0.8, 0.7, 1.0,
            0.2, 0.6, 0.1, 1.0, 0.2, 0.6, 0.1, 1.0, 0.2, 0.6, 0.1, 1.0, 0.2, 0.6, 0.1, 1.0,
            0.9, 0.7, 0.6, 1.0, 0.9, 0.7, 0.6, 1.0, 0.9, 0.7, 0.6, 1.0, 0.9, 0.7, 0.6, 1.0,
            1.0, 1.0, 0.9, 1.0, 1.0, 1.0, 0.9, 1.0, 1.0, 1.0, 0.9, 1.0, 1.0, 1.0, 0.9, 1.0,
            1.0, 0.3, 0.6, 1.0, 1.0, 0.3, 0.6, 1.0, 1.0, 0.3, 0.6, 1.0, 1.0, 0.3, 0.6, 1.0,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        this.cubeIndexBuffer_ = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeIndexBuffer_);

        let indices = [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23
        ];

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    };

    getAngle() {
        let time = new Date().getMilliseconds();

        let elapsed = time - this.lastTime_;
        this.currentAngle_ += (90 * elapsed) / 1000.0;

        this.lastTime_ = time;

        if (this.currentAngle_ >= 360) {
            this.currentAngle_ = 0;
        }
        return this.currentAngle_ * Math.PI / 180;
    };

    private mMatrix_: Float32Array = new Float32Array(16);
    private lastTime_: number = 0;
    private currentAngle_: number = 0;
};