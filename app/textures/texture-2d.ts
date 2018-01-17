import { TextureData } from "./texture-loader"

export class Texture2d {

    get id() { return this.texture_id; };

    private texture_id: WebGLTexture;

    private generate_mipmaps = false;

    constructor(private gl: WebGL2RenderingContext) {
        this.texture_id = this.gl.createTexture();
    };

    bindTexture() {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture_id);
    };

    uploadTextureData(data: TextureData) {
        this.bindTexture();
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    };

    allocateTextureStorage(width: number, height: number, generate_mipmaps = false) {
        this.bindTexture();
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.FLOAT, null);
        if (generate_mipmaps) {
            this.generate_mipmaps = true;
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
        }      
    };

    beginRender() {
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.id, 0);
    };

    finishRender() {
        // Regenerate mipmaps after LoD 0 changes:
        if (this.generate_mipmaps) {
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
        }
    };
};