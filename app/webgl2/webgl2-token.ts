import { InjectionToken } from "@angular/core";

export const WEBGL2 = new InjectionToken<WebGL2RenderingContext>("webgl2");
export const GLTF = new InjectionToken<glTFData>("gltf data");
export const GLSL_VERSION = new InjectionToken<string>("glsl version");
export const SHADER_DEFINITIONS = new InjectionToken<string[]>("#define to add to beginning of shader source");