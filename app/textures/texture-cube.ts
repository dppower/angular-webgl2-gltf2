import { TextureLoader } from "./texture-loader"

export class TextureCube {

    get id() { return this.texture_id; };

    private texture_id: WebGLTexture;

    constructor(private gl: WebGL2RenderingContext) {
        this.texture_id = this.gl.createTexture();
    };

    bindTexture() {
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture_id);
    };

    uploadTextureData(image_data: ImageData[]) {
        this.bindTexture();
        for (let i = 0; i < 6; i++) {
            this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image_data[i]);
        }
        // Called after cube_map is completed:
        this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
    };

    allocateTextureStorage(width: number, height: number) {
        this.bindTexture();
        for (let i = 0; i < 6; i++) {
            this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.FLOAT, null);
        }
        this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
    };
};