declare namespace glTF {

    interface Sampler {
        magFilter: number;
        minFilter: number;
        wrapS: number;
        wrapT: number;
    }

    type ImageMimeType = "image/jpeg" | "image/png";

    interface Image {
        uri?: string;
        mimeType?: ImageMimeType;
        bufferView?: number;
    }

    interface Texture {
        source: number;
        sampler?: number;
    }

    interface TextureInfo {
        index: number;
        texCoord?: number; // default 0 => TEXCOORD_0
    }

    interface NormalTextureInfo extends TextureInfo {
        scale?: number;
    }

    interface OcclusionTextureInfo extends TextureInfo {
        strength?: number;
    }

    interface pbrMetallicRoughness {
        baseColorFactor: number[]; // default [1, 1, 1, 1]
        baseColorTexture?: TextureInfo;
        metallicFactor?: number; // 0 is dielectric, 1 is metal, default: 1
        roughnessFactor?: number; // 0 is smooth, 1 is rough, default: 1
        metallicRoughnessTexture?: TextureInfo; // Metallic is read from B channel, Roughness read from G channel
    }

    interface Material {
        pbrMetallicRoughness: pbrMetallicRoughness;
        normalTexture?: NormalTextureInfo;
        occulsionTexture?: OcclusionTextureInfo; // Read from R channel
        emissiveTexture?: TextureInfo;
        emissiveFactor?: number[]; // Default: [0, 0, 0]
        alphaMode?: "OPAQUE" | "MASK" | "BLEND"; // Default: OPAQUE
        alphaCutoff?: number;
        doubleSided?: boolean;
    }
}

interface glTF {
    samplers?: glTF.Sampler[];
    images?: glTF.Image[];
    textures?: glTF.Texture[];
    materials?: glTF.Material[];
}