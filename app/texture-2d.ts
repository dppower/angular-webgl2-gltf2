type MAG_FILTER = "nearest" | "linear";
type MIN_FILTER = "nearest" | "linear" | "linear-nearest" | "linear-linear" | "nearest-linear" | "nearest-nearest";

export class Texture2d {

    get id() { return this.texture_id; };

    private texture_id: WebGLTexture;

    constructor(public width: number, public height: number, private gl: WebGL2RenderingContext) {
        this.texture_id = this.gl.createTexture();
    };

    bindTexture() {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture_id);
    };

    // TODO: move this functionality to a Sampler Object.
    setTextureParameters(min_filter?: MIN_FILTER, mag_filter?: MAG_FILTER, generate_mipmaps = true) {
        this.bindTexture()

        switch (mag_filter) {
            case ("nearest"):
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
                break;
            case ("linear"):
            default:
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        }

        switch (min_filter) {
            case ("nearest"):
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
                break;
            case ("linear"):
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                break;
            case ("linear-nearest"):
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
                break;
            case ("linear-linear"):
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
                break;           
            case ("nearest-nearest"):
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST_MIPMAP_NEAREST);
                break;
            case ("nearest-linear"):
            default:
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST_MIPMAP_LINEAR);
        }

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        if (generate_mipmaps) {
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
        }
    };

    allocateTextureStorage(url?: string) {
        this.bindTexture();
        if (url) {
            // fetch from server
        }
        else {
            // Upload no texture data
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.FLOAT, null);
        }
    };
};