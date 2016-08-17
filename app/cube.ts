import { Injectable, Inject, provide, OpaqueToken, Injector } from "@angular/core";

import { Transform } from "./transform";
import { Vec3 } from "./vec3";
import { Quaternion } from "./quaternion";
import { CubeMesh } from "./cube-mesh";
import { ShaderProgram } from "./shader-program";
import { Camera } from "./game-camera";

@Injectable()
export class Cube {

    get name() {
        return this.token_.toString();
    };

    get transform() {
        return this.transform_;
    };

    private transform_: Transform;
    private uniform_colour_ = new Float32Array([1.0, 1.0, 1.0, 1.0]);

    constructor(private token_: OpaqueToken, position = new Vec3(0.0, 0.0, 0.0)) {

        this.transform_ = new Transform(position);
    };

    /**
     * Set a unique uniform color for use in the picking renderer, override default color of white.
     */
    setUniformColor(color: Float32Array) {
        this.uniform_colour_.set(color);
    };


    Start(gl: WebGLRenderingContext) {



        //this.texture_ = gl.createTexture();
        //let texture = new Image();
        //texture.onload = () => {
        //    gl.activeTexture(gl.TEXTURE0);
        //    gl.bindTexture(gl.TEXTURE_2D, this.texture_);
        //    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
        //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        //    gl.generateMipmap(gl.TEXTURE_2D);
        //    gl.bindTexture(gl.TEXTURE_2D, null);
        //    this.textureLoaded_ = true;
        //};
        //texture.src = "textures/cube-texture.png";
    };

    Update(dt: number) {
        this.transform_.update();
    };

};

//const cubes = new Map<OpaqueToken, Cube>();

const cubes = new OpaqueToken("cubes");

const cube_001 = new OpaqueToken("cube-001");
const cube_002 = new OpaqueToken("cube-002");
const cube_003 = new OpaqueToken("cube-003");

export const cubes_provider = provide(cubes, { useValue: [cube_001, cube_002, cube_003] });

//const cube_factory = (position: Vec3, colour: Float32Array, token: OpaqueToken) => {
//    return (injector: Injector) => {
//        let mesh = injector.get(CUBE_MESH);
//        return new Cube(mesh, colour, token, position);
//    };
//};

//export const cubes = [
//    provide(cube_001, { useFactory: cube_factory(new Vec3(0.0, 0.0, 0.0), new Float32Array([1.0, 0.0, 0.0, 1.0]), cube_001), deps: [Injector, CUBE_MESH] }),
//    provide(cube_002, { useFactory: cube_factory(new Vec3(2.0, 0.0, -1.0), new Float32Array([0.0, 1.0, 0.0, 1.0]), cube_002), deps: [Injector, CUBE_MESH] }),
//    provide(cube_003, { useFactory: cube_factory(new Vec3(-2.0, 1.0, -3.0), new Float32Array([0.0, 0.0, 1.0, 1.0]), cube_003), deps: [Injector, CUBE_MESH] })
//];