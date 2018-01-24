import { StaticProvider, InjectionToken } from "@angular/core";

import { WEBGL2, GLSL_VERSION, SHADER_DEFINITIONS } from "../webgl2/webgl2-token";
import { VertexShaderSource, FragmentShaderSource } from "./shader-source";
import { ShaderProgram } from "./shader-program";

const VERTEX_SHADER = new InjectionToken<VertexShaderSource>("vertex-shader");
const FRAGMENT_SHADER = new InjectionToken<FragmentShaderSource>("fragment-shader");
export const PBR_SHADER = new InjectionToken<ShaderProgram>("pbr shader");

interface ShaderDefines {
    TEXCOORD_0_ACTIVE?: true;
    TEXCOORD_1_ACTIVE?: true;
    COLOR_0_ACTIVE?: true;
    BASE_COLOR_TEXTURE_ACTIVE?: true;
    METAL_ROUGH_MAP_ACTIVE?: true;
    NORMAL_MAP_ACTIVE?: true;
    EMISSIVE_MAP_ACTIVE?: true;
    OCCLUSION_ACTIVE?: true;
    USE_IBL?: true;
}

export const shader_providers: StaticProvider[] = [
    { provide: GLSL_VERSION, useValue: "#version 300 es" },
    { provide: SHADER_DEFINITIONS, useValue: [] },
    {
        provide: VERTEX_SHADER, useValue: {
            attributes: ["POSITION", "NORMAL", "TANGENT", "TEXCOORD_0", "TEXCOORD_1", "COLOR_0"],
            uniforms: ["u_projection_matrix", "u_view_matrix", "u_normal_matrix"],
            source: "layout(location = 0) in vec3 POSITION;\nout vec3 v_position;\nlayout(location = 1) in vec3 NORMAL;\nout vec3 v_normal;\n#ifdef NORMAL_MAP_ACTIVE\nlayout(location = 2) in vec4 TANGENT;\nout vec4 v_tangent;\n#endif\n#ifdef TEXCOORD_0_ACTIVE\nlayout(location = 3) in vec2 TEXCOORD_0;\nout vec2 v_texcoord_0;\n#endif\n#ifdef TEXCOORD_1_ACTIVE\nlayout(location = 4) in vec2 TEXCOORD_1;\nout vec2 v_texcoord_1;\n#endif\n#ifdef COLOR_0_ACTIVE\nlayout(location = 5) in vec4 COLOR_0;\nout vec4 v_color_0;\n#endif\nuniform mat4 u_projection_matrix;\nuniform mat4 u_view_matrix;\nuniform mat3 u_normal_matrix;\nvoid main(void) {\nv_position = vec3(u_view_matrix * vec4(POSITION, 1.0));\nv_normal = normalize(u_normal_matrix * NORMAL);\n#ifdef NORMAL_MAP_ACTIVE\nvec3 tangent = normalize(u_normal_matrix * TANGENT.xyz);\nv_tangent = vec4(tangent, TANGENT.w);\n#endif\n#ifdef TEXCOORD_0_ACTIVE\nv_texcoord_0 = TEXCOORD_0;\n#endif\n#ifdef TEXCOORD_1_ACTIVE\nv_texcoord_1 = TEXCOORD_1;\n#endif\n#ifdef COLOR_0_ACTIVE\nv_color_0 = COLOR_0;\n#endif\ngl_Position = u_projection_matrix * vec4(POSITION, 1.0);\n}\n"
        }
    },
    {
        provide: FRAGMENT_SHADER, useValue: {
            attributes: ["v_position", "v_normal", "v_texcoord_0", "v_texcoord_1", "v_color_0", "v_tangent"],
            uniforms: ["u_light_color", "u_light_direction", "u_base_color_factor", "u_base_color_texture", "u_metallic_roughness_factors", "u_occlusion_strength", "u_metal_rough_texture", "u_normal_map", "u_normal_scale", "u_emissive_texture", "u_emissive_factor"],
            source: "precision highp float;\nconst float PI = 3.1415926536;\nuniform vec3 u_light_color;\nuniform vec3 u_light_direction;\n#ifdef USE_IBL\n#endif\nin vec3 v_position;\nin vec3 v_normal;\n#ifdef TEXCOORD_0_ACTIVE\nin vec2 v_texcoord_0;\n#endif\n#ifdef TEXCOORD_1_ACTIVE\nin vec2 v_texcoord_1;\n#endif\n#ifdef COLOR_0_ACTIVE\nin vec4 v_color_0;\n#endif\nuniform vec4 u_base_color_factor;\n#ifdef BASE_COLOR_TEXTURE_ACTIVE\nuniform sampler2D u_base_color_texture;\n#endif\nuniform vec2 u_metallic_roughness_factors;\n#ifdef METAL_ROUGH_MAP_ACTIVE\n#ifdef OCCLUSION_ACTIVE\nuniform float u_occlusion_strength;\n#endif\nuniform sampler2D u_metal_rough_texture;\n#endif\n#ifdef NORMAL_MAP_ACTIVE\nuniform sampler2D u_normal_map;\nuniform float u_normal_scale;\nin vec4 v_tangent;\n#endif\n#ifdef EMISSIVE_MAP_ACTIVE\nuniform sampler2D u_emissive_texture;\nuniform vec3 u_emissive_factor;\n#endif\nout vec4 fragment_color;\nvec3 get_normal() {\n#ifdef NORMAL_MAP_ACTIVE\nvec3 ns = texture(u_normal_map, v_texcoord_0).rgb;\nvec3 n = normalize(v_normal);\nvec3 t = normalize(v_tangent.xyz);\nvec3 b = normalize(cross(n, t) * v_tangent.w);\nmat3 tbn = mat3(t, b, n);\nreturn normalize(tbn * ((2.0 * ns - 1.0) * vec3(u_normal_scale, u_normal_scale, 1.0)));\n#else\nreturn normalize(v_normal);\n#endif\n}\nvec3 diffuse_lambert(vec3 diffuse_color) {\nreturn diffuse_color / PI;\n}\nvec3 f_schlick(float NoV, vec3 F0) {\nreturn F0 + (vec3(1.0) - F0) * pow((1.0 - NoV), 5.0);\n}\nfloat g_ggx(float a, float NoL, float NoV) {\nfloat a_2 = a * a;\nfloat g_lh = NoL + sqrt(NoL * NoL * (1.0 - a_2) + a_2);\nfloat g_vh = NoV + sqrt(NoV * NoV * (1.0 - a_2) + a_2);\nreturn 0.5 / (g_lh * g_vh);\n}\nfloat d_ggx(float a, float NoH) {\nfloat a_2 = a * a;\nfloat d = 1.0 + (NoH * NoH * (a_2 - 1.0));\nreturn a_2 / (PI * d * d);\n}\nvoid main() {\nfloat metallic = u_metallic_roughness_factors.x;\nfloat roughness = u_metallic_roughness_factors.y;\n#ifdef METAL_ROUGH_MAP_ACTIVE\nvec4 metal_rough_sample = texture(u_metal_rough_texture, v_texcoord_0);\nmetallic = metal_rough_sample.b * metallic;\nroughness = metal_rough_sample.g * roughness;\n#endif\nroughness = clamp(roughness, 0.04, 1.0);\nmetallic = clamp(metallic, 0.0, 1.0);\nfloat alpha = roughness * roughness;\n#ifdef BASE_COLOR_TEXTURE_ACTIVE\nvec4 base_color = texture(u_base_color_texture, v_texcoord_0) * u_base_color_factor;\n#else\n#ifdef COLOR_0_ACTIVE\nvec4 base_color = v_color_0;\n#else\nvec4 base_color = u_base_color_factor;\n#endif\n#endif\nvec3 normal = get_normal();\nvec3 light = normalize(u_light_direction);\nvec3 view = normalize(-v_position);\nvec3 half_vector = normalize(light + view);\nfloat NoL = max(0.0, dot(normal, light));\nfloat NoV = max(0.0, dot(normal, view));\nfloat NoH = max(0.0, dot(normal, half_vector));\nvec3 F0 = mix(vec3(0.04), base_color.rgb, metallic);\nvec3 F = f_schlick(NoV, F0);\nfloat D = d_ggx(alpha, NoH);\nfloat G = g_ggx(alpha, NoL, NoV);\nbase_color *= 1.0 - metallic;\nvec3 diffuse_color = (vec3(1.0) - F) * diffuse_lambert(vec3(base_color));\nvec3 specular_color = D * G * F;\nvec3 final_color = NoL * (diffuse_color + specular_color) * u_light_color;\nfragment_color = vec4(final_color, 1.0);\n}\n"
        }
    },
    { provide: PBR_SHADER, useClass: ShaderProgram, deps: [WEBGL2, GLSL_VERSION, SHADER_DEFINITIONS, VERTEX_SHADER, FRAGMENT_SHADER] }
];

//const shader_program_factory = (vertex_source: VertexShaderSource, fragment_source: FragmentShaderSource) => {
//    return (injector: Injector) => {
//        let gl = injector.get(webgl2);
//        let shader_program = new ShaderProgram(gl, vertex_source, fragment_source);
//        return shader_program;
//    }
//};