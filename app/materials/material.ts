import { Sampler } from "./sampler";
import { ShaderProgram } from "../shaders/shader-program";
import { MaterialLoader } from "./material-loader"
import { Texture2d } from "./texture-2d";

export class Material {

    // Base Color
    base_color_factor: number[];
    base_color_texture: Texture2d;
    base_color_sampler: Sampler;

    // Occlusion (R) Metal (B) Roughness (G)
    metallic_factor: number;
    roughness_factor: number;
    metallic_roughness_texture: Texture2d;
    metallic_roughness_sampler: Sampler;

    constructor(private gl_context_: WebGL2RenderingContext,
        private gltf_data_: glTF, private material_loader_: MaterialLoader
    ) { };

    setTextures(material_index: number) {
        let data = this.gltf_data_.materials[material_index];
        if (data.pbrMetallicRoughness) {
            // Base Color
            this.base_color_factor = data.pbrMetallicRoughness.baseColorFactor || [1, 1, 1, 1];
            if (data.pbrMetallicRoughness.baseColorTexture) {
                let texture_index = data.pbrMetallicRoughness.baseColorTexture.index;
                this.base_color_texture = this.material_loader_.getTexture(texture_index);
                this.base_color_sampler = this.material_loader_.getSampler(texture_index);
            }
            // Occlusion Metallic Roughness
            this.metallic_factor = data.pbrMetallicRoughness.metallicFactor || 1;
            this.roughness_factor = data.pbrMetallicRoughness.roughnessFactor || 1;
            if (data.pbrMetallicRoughness.metallicRoughnessTexture) {
                let texture_index = data.pbrMetallicRoughness.metallicRoughnessTexture.index;
                this.metallic_roughness_texture = this.material_loader_.getTexture(texture_index);
                this.metallic_roughness_sampler = this.material_loader_.getSampler(texture_index);
            }
        }
    };

    bindTextures(program: ShaderProgram) {
        // Base Color
        this.gl_context_.uniform4fv(program.getUniform("base_color_factor"), this.base_color_factor);
        if (this.base_color_texture) {
            this.gl_context_.activeTexture(this.gl_context_.TEXTURE0);
            this.base_color_texture.bindTexture();
            this.base_color_sampler.bindSampler(0);
            this.gl_context_.uniform1i(program.getUniform("base_color_texture"), 0);
        }

        // Occlusion Metallic Roughness
        this.gl_context_.uniform1f(program.getUniform("metallic_factor"), this.metallic_factor);
        this.gl_context_.uniform1f(program.getUniform("roughness_factor"), this.roughness_factor);
        if (this.metallic_roughness_texture) {
            this.gl_context_.activeTexture(this.gl_context_.TEXTURE1);
            this.metallic_roughness_texture.bindTexture();
            this.metallic_roughness_sampler.bindSampler(1);
            this.gl_context_.uniform1i(program.getUniform("metal_rough_texture"), 1);
        }
    };
};