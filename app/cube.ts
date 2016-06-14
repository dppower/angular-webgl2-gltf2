import {Injectable, Inject, provide, OpaqueToken, Injector} from "@angular/core";
import {Transform} from "./transform";
import {Vec3} from "./vec3";
import {Quaternion} from "./quaternion";
import {Mesh, CUBE_MESH} from "./cube-mesh";
import {ShaderProgram} from "./shader-program";
import {Camera} from "./game-camera";

@Injectable()
export class Cube {

    constructor(@Inject(CUBE_MESH) private mesh_: Mesh, position = new Vec3(0.0, 0.0, 0.0)) {
        this.transform_ = new Transform("cube", position);
    };

    vertices_: WebGLBuffer;
    normals_: WebGLBuffer;
    texture_: WebGLTexture;
    textureCoords_: WebGLBuffer;
    textureLoaded_ = false;

    get transform() {
        return this.transform_;
    };

    initialise(gl: WebGLRenderingContext) {

        this.vertices_ = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh_.vertices), gl.STATIC_DRAW);

        this.normals_ = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normals_);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh_.normals), gl.STATIC_DRAW);

        this.textureCoords_ = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoords_);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh_.UVMap), gl.STATIC_DRAW);

        this.texture_ = gl.createTexture();
        let texture = new Image();
        texture.onload = () => {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture_);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            this.textureLoaded_ = true;
        };
        texture.src = "textures/cube-texture.png";
    };

    update(dt: number) {
        let q = Quaternion.fromAxisAngle(new Vec3(0.0, 1.0, 0.0), 0.05 * dt);
        //this.transform_.rotate(q);
        this.transform_.update();
    };

    draw(program: ShaderProgram, gl: WebGLRenderingContext, camera: Camera) {

        if (!this.textureLoaded_) return;

        program.use();

        // Texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture_);
        gl.uniform1i(program.getUniform("uBaseTexture"), 0);

        // Attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_);
        gl.vertexAttribPointer(program.getAttribute("aVertexPosition"), 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normals_);
        gl.vertexAttribPointer(program.getAttribute("aNormals"), 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoords_);
        gl.vertexAttribPointer(program.getAttribute("aTextureCoords"), 2, gl.FLOAT, false, 0, 0);

        // Uniforms
        gl.uniformMatrix4fv(program.getUniform("uView"), false, camera.view);
        gl.uniformMatrix4fv(program.getUniform("uProjection"), false, camera.projection);
        gl.uniformMatrix4fv(program.getUniform("uTransform"), false, this.transform_.transform.array);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    };

    private transform_: Transform;
};

export const CUBE_1 = new OpaqueToken("cube-1");
export const CUBE_2 = new OpaqueToken("cube-2");
export const CUBE_3 = new OpaqueToken("cube-3");

const cubeFactory = (position: Vec3) => {
    let createCube = (injector: Injector) => {
        let mesh = injector.get(CUBE_MESH);
        return new Cube(mesh, position);
    };
    return createCube;
};

export const CUBES = [
    provide(CUBE_1, { useFactory: cubeFactory(new Vec3(0.0, 0.0, 0.0)), deps: [Injector, CUBE_MESH] }),
    provide(CUBE_2, { useFactory: cubeFactory(new Vec3(2.0, 0.0, -1.0)), deps: [Injector, CUBE_MESH] }),
    provide(CUBE_3, { useFactory: cubeFactory(new Vec3(-2.0, 1.0, -3.0)), deps: [Injector, CUBE_MESH] })
];