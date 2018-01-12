import { glObject } from "../gl-object";

export interface Texture {
    sampler: string;
    source: string;
}

export class glTexture extends glObject {
    
    constructor(
        public readonly name: string,
        public readonly sampler: string,
        public readonly source: number
    ) {
        super(name);
    };

    toGLTF() {
        return {
            sampler: this.sampler,
            source: this.source
        };
    };
};