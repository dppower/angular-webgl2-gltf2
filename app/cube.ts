import {Injectable} from "@angular/core";
import {Transform} from "./transform";
import {Vec3} from "./vec3";
import {CubeMesh} from "./cube-mesh";
import {WebGLProgramService} from "./webgl-program";

@Injectable()
export class Cube {

    constructor() { };

    vertices_: WebGLBuffer;
    normals_: WebGLBuffer;
    texture_: WebGLTexture;
    textureCoords_: WebGLBuffer;
    textureLoaded_ = false;

    initialise(gl: WebGLRenderingContext) {
        let mesh = CubeMesh;

        this.vertices_ = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);

        this.normals_ = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normals_);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.normals), gl.STATIC_DRAW);

        this.textureCoords_ = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoords_);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.UVMap), gl.STATIC_DRAW);

        this.texture_ = gl.createTexture();
        let texture = new Image();
        texture.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, this.texture_);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            this.textureLoaded_ = true;
        };
        texture.src = "cube-texture.png";
    };

    update(dt: number) {
        this.transform_.rotate(new Vec3(0.0, 1.0, 0.0), 0.02 * dt);
    };

    draw(program: WebGLProgramService, gl: WebGLRenderingContext) {

        if (!this.textureLoaded_) return;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture_);
        gl.uniform1i(program.uSampler, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_);
        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normals_);
        gl.vertexAttribPointer(program.aNormals, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoords_);
        gl.vertexAttribPointer(program.aTextureCoords, 2, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(program.uModel, false, this.transform_.transform);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    };

    private transform_ = new Transform();
};