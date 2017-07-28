import { gltfObject } from "./gltf-object";
import * as gl from "./gl-constants";

export class glSampler extends gltfObject {

    get id() {
        return this.sampler_id;
    };

    constructor(private sampler_id, private magFilter = gl.LINEAR, private minFilter = gl.NEAREST_MIPMAP_LINEAR,
        private wrapS = gl.REPEAT, private wrapT = gl.REPEAT) {
        super();
    };

    toGLTF() {
        return {
            magFilter: this.magFilter,
            minFilter: this.minFilter,
            wrapS: this.wrapS,
            wrapT: this.wrapT
        }
    };
};