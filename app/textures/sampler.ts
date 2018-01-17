export type MAG_FILTER = "NEAREST" | "LINEAR";
export type MIN_FILTER = "NEAREST" | "LINEAR" | "LINEAR_MIPMAP_LINEAR" | "LINEAR_MIPMAP_NEAREST" | "NEAREST_MIPMAP_LINEAR" | "NEAREST_MIPMAP_NEAREST";
export type CLAMP_TYPE = "CLAMP_TO_EDGE" | "REPEAT";

export class Sampler {

    private sampler: WebGLSampler;

    constructor(private gl: WebGL2RenderingContext) {
        this.sampler = this.gl.createSampler();
    };

    setSamplerParameters(min_filter: MIN_FILTER, mag_filter: MAG_FILTER, clamp_type: CLAMP_TYPE) {
        // Filtering
        this.gl.samplerParameteri(this.sampler, this.gl.TEXTURE_MAG_FILTER, this.gl[mag_filter]);
        this.gl.samplerParameteri(this.sampler, this.gl.TEXTURE_MIN_FILTER, this.gl[min_filter]);
        // Wrapping Mode
        this.gl.samplerParameteri(this.sampler, this.gl.TEXTURE_WRAP_R, this.gl[clamp_type]);
        this.gl.samplerParameteri(this.sampler, this.gl.TEXTURE_WRAP_S, this.gl[clamp_type]);
        this.gl.samplerParameteri(this.sampler, this.gl.TEXTURE_WRAP_T, this.gl[clamp_type]);
    };

    bindSampler(texture_unit: number) {
        this.gl.bindSampler(texture_unit, this.sampler);
    }

    deleteSampler() {
        this.gl.deleteSampler(this.sampler);
    }
}