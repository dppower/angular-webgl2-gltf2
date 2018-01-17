import { Sampler } from "../textures/sampler";
import { ShaderProgram } from "../shaders/shader-program";
import { TextureLoader } from "../textures/texture-loader"
import { Texture2d } from "../textures/texture-2d";

export class Material {

    // Base Color
    base_color_factor = [1, 1, 1, 1];
    base_color_texture: Texture2d;
    base_color_sampler: Sampler;

    // Occlusion (R) Metal (B) Roughness (G)
    metallic_factor = 1;
    roughness_factor = 1;
    metallic_roughness_texture: Texture2d;
    metallic_roughness_sampler: Sampler;

    constructor(private gl_context_: WebGL2RenderingContext,
        private gltf_data_: glTF, private texture_loader_: TextureLoader,
        private material_index_: number
    ) {
        this.getTextures();
    };

    getTextures() {
        let data = this.gltf_data_.materials[this.material_index_];
        // Base Color
        this.base_color_factor = data.pbrMetallicRoughness.baseColorFactor;
        let index = data.pbrMetallicRoughness.baseColorTexture.index;
        this.base_color_texture = index && this.texture_loader_.getTexture(index);
        this.base_color_sampler = this.base_color_texture && this.texture_loader_.getSampler(index);
        // Occlusion Metallic Roughness
        this.metallic_factor = data.pbrMetallicRoughness.metallicFactor;
        this.roughness_factor = data.pbrMetallicRoughness.roughnessFactor;
        index = data.pbrMetallicRoughness.metallicRoughnessTexture.index;
        this.metallic_roughness_texture = index && this.texture_loader_.getTexture(index);
        this.metallic_roughness_sampler = this.metallic_roughness_texture && this.texture_loader_.getSampler(index);
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