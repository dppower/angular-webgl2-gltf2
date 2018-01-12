import { glObject } from "../gl-object";
import { gl } from "../gl-constants";

type MAG_FILTER = gl.NEAREST | gl.LINEAR;

type MIN_FILTER =
    gl.NEAREST | gl.LINEAR |
    gl.LINEAR_MIPMAP_LINEAR | gl.LINEAR_MIPMAP_NEAREST |
    gl.NEAREST_MIPMAP_LINEAR | gl.NEAREST_MIPMAP_NEAREST;

type WRAPPING_MODE = gl.CLAMP_TO_EDGE | gl.REPEAT;

export class glSampler extends glObject {
    
    constructor(name: string = "default",
        public readonly magFilter: MAG_FILTER = gl.LINEAR,
        public readonly minFilter: MIN_FILTER = gl.NEAREST_MIPMAP_LINEAR,
        public readonly wrapS: WRAPPING_MODE = gl.REPEAT,
        public readonly wrapT: WRAPPING_MODE = gl.REPEAT
    ) {
        super(name);
    };

    toGLTF() {
        return {
            magFilter: this.magFilter,
            minFilter: this.minFilter,
            wrapS: this.wrapS,
            wrapT: this.wrapT,
            name: this.name
        }
    };
};