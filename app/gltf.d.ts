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
        bufferView: number;
    }

    interface Texture {
    }

    interface Material {
    }
}

interface glTF {
    samplers?: glTF.Sampler[];
    images?: glTF.Image[];
}