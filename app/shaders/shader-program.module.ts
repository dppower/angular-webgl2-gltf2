//import { NgModule, Inject, Injectable, Injector, OpaqueToken } from "@angular/core";

//import { webgl2 } from "../canvas/webgl2-token";
//import { VertexShaderSource, FragmentShaderSource } from "./shader-source";
//import { ShaderProgram } from "./shader-program";

//import diffuse_uniform_color_fs from "./diffuse-uniform-color.fs";
//import diffuse_uniform_color_vs from "./diffuse-uniform-color.vs";
//import diffuse_texture_fs from "./diffuse-base-texture.fs";
//import diffuse_texture_vs from "./diffuse-base-texture.vs";
//import uniform_color_fs from "./uniform-color.fs";
//import uniform_color_vs from "./uniform-color.vs";
//import diffuse_oren_nayar_fs from "./diffuse-oren-nayar.fs";
//import pbr_ggx_fs from "./pbr-ggx.fs";
//import sky_quad_vs from "./sky-quad.vs";
//import sky_quad_fs from "./sky-quad.fs";
//import texture_2d_vs from "./texture-2d.vs";
//import texture_cube_vs from "./texture-cube.vs";
//import transmittance_fs from "./transmittance.fs";
//import inscatter_fs from "./inscattering.fs";
//import inscatter_3d_fs from "./inscattering-3d.fs";
//import per_vertex_fs from "./per-vertex-color.fs";
//import per_vertex_vs from "./per-vertex-color.vs";


//const shader_program_factory = (vertex_source: VertexShaderSource, fragment_source: FragmentShaderSource) => {
//    return (injector: Injector) => {
//        let gl = injector.get(webgl2);
//        let shader_program = new ShaderProgram(gl, vertex_source, fragment_source);
//        return shader_program;
//    }
//};

//export const diffuse_uniform_shader = new OpaqueToken("diffuse-uniform-color-shader");
//export const diffuse_texture_shader = new OpaqueToken("diffuse-texture-shader");
//export const diffuse_oren_nayar_shader = new OpaqueToken("diffuse-oren-nayar-shader");
//export const uniform_color_shader = new OpaqueToken("uniform-color-shader");
//export const pbr_ggx_shader = new OpaqueToken("pbr-ggx-shader");
//export const transmittance_shader = new OpaqueToken("transmittance-shader");
//export const inscatter_shader = new OpaqueToken("inscatter-shader");
//export const inscatter_3d_shader = new OpaqueToken("inscatter-3d-shader");
//export const skyquad_shader = new OpaqueToken("skyquad-shader");
//export const per_vertex_color_shader = new OpaqueToken("per-vertex-color-shader");

//export const shader_providers = [
//    { provide: uniform_color_shader, useFactory: shader_program_factory(uniform_color_vs, uniform_color_fs), deps: [Injector, webgl2] },
//    { provide: diffuse_texture_shader, useFactory: shader_program_factory(diffuse_texture_vs, diffuse_texture_fs), deps: [Injector, webgl2] },
//    { provide: diffuse_uniform_shader, useFactory: shader_program_factory(diffuse_uniform_color_vs, diffuse_uniform_color_fs), deps: [Injector, webgl2] },
//    { provide: diffuse_oren_nayar_shader, useFactory: shader_program_factory(diffuse_uniform_color_vs, diffuse_oren_nayar_fs), deps: [Injector, webgl2] },
//    { provide: pbr_ggx_shader, useFactory: shader_program_factory(diffuse_texture_vs, pbr_ggx_fs), deps: [Injector, webgl2] },
//    { provide: transmittance_shader, useFactory: shader_program_factory(texture_2d_vs, transmittance_fs), deps: [Injector, webgl2] },
//    { provide: inscatter_shader, useFactory: shader_program_factory(texture_cube_vs, inscatter_fs), deps: [Injector, webgl2] },
//    { provide: inscatter_3d_shader, useFactory: shader_program_factory(texture_2d_vs, inscatter_3d_fs), deps: [Injector, webgl2] },
//    { provide: skyquad_shader, useFactory: shader_program_factory(sky_quad_vs, sky_quad_fs), deps: [Injector, webgl2] },
//    { provide: per_vertex_color_shader, useFactory: shader_program_factory(per_vertex_vs, per_vertex_fs), deps: [Injector, webgl2] }
//]