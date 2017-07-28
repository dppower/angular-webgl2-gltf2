import { Observable, Observer } from "rxjs/Rx";
import { gltfObject } from "./gltf-object";
import { glSampler } from "./gl-sampler";
import { glImage } from "./gl-image";
import * as gl from "./gl-constants";

export class glTexture extends gltfObject {

    sampler: glSampler;
    source: glImage;

    constructor(
        private texture_id,
        private internalFormat, // In webgl1 format = internalFormat. Any texture (base_color) in sRGB should be SRGB8_ALPHA8
        private format = gl.RGBA, // Format of pixel data that will be passed to the gpu, getImageData() returns rgba.       
        private target = gl.TEXTURE_2D, // gl.BindTexture target, TEXTURE_2D, TEXTURE_CUBE_MAP, (TEXTURE_3D, TEXTURE_2D_ARRAY)
        private type = gl.UNSIGNED_BYTE // Most/all textures will be 8 bit per channel
    ) {
        super();
    };

    toGLTF() {
        return {
            sampler: this.sampler.id,
            source: this.source.id,
            format: this.format,
            internalFormat: this.internalFormat,
            target: this.target,
            type: this.type
        };
    };
};