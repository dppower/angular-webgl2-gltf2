import { OpaqueToken, Injector } from "@angular/core";

import { Transform, Vec3, Quaternion } from "../game-engine/transform";
import { RenderObject, RenderObjectData } from "../renderers/render-object";
import { ObjectBuffer } from "./object-buffer";
import { webgl2 } from "../canvas/render-context";
//import { CubeMesh } from "./cube-mesh";
import { Mesh } from "./mesh";
import cube_mesh from "./data/cube";
import painted_cube from "../renderers/objects/painted-cube";

export const cubes = new OpaqueToken("cubes")
export const cube_vertex_buffers = new OpaqueToken("cube-vertex-buffers");
export const cube_mesh_token = new OpaqueToken("cube-mesh");

//const cube_001 = new OpaqueToken("cube-001");
//const cube_002 = new OpaqueToken("cube-002");
//const cube_003 = new OpaqueToken("cube-003");

const generate_buffer_from_mesh = () => {
    return (injector: Injector) => {
        let gl = (<WebGL2RenderingContext>injector.get(webgl2));
        let mesh = (<Mesh>injector.get(cube_mesh_token));
        let buffer = new ObjectBuffer(gl);
        buffer.initVertexArray(mesh);
        return buffer;
    };
};

const cube_factory = (object_data: RenderObjectData) => {
    return (injector: Injector) => {
        let buffer = (<ObjectBuffer>injector.get(cube_vertex_buffers));
        return new RenderObject(object_data, buffer);
    };
};



export const cube_provider = [
    { provide: cube_mesh_token, useValue: cube_mesh },
    { provide: cube_vertex_buffers, useFactory: generate_buffer_from_mesh(), deps: [Injector, cube_mesh_token, webgl2] },
    { provide: cubes, useFactory: cube_factory(painted_cube), deps: [Injector, cube_vertex_buffers], multi: true }
    //{ provide: cubes, useFactory: cube_factory(cube_001, new Vec3(0.0, 0.0, 0.0), new Quaternion()), deps: [Injector, cube_vertex_buffers], multi: true },
    //{ provide: cubes, useFactory: cube_factory(cube_002, new Vec3(2.0, 0.0, 0.0), new Quaternion()), deps: [Injector, cube_vertex_buffers], multi: true },
    //{ provide: cubes, useFactory: cube_factory(cube_003, new Vec3(-2.0, 0.0, 0.0), new Quaternion()), deps: [Injector, cube_vertex_buffers], multi: true }
];