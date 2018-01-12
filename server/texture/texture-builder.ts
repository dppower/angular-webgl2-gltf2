import fs = require("fs");
import path = require("path");

import { glSampler } from "./gl-sampler";
import { glImage } from "./gl-image";
import { glTexture, Texture } from "./gl-texture";

const image_file_pattern = /^.*\.(?:png|jpeg)$/;

export class TextureBuilder {
 
    private texture_data_: { [name: string]: Texture };
    private image_files_: string[];

    constructor(private input_dir_: string, private images_dir_: string) {};

    buildTextureData() {
        this.getTextureInput();
        this.getImageFileList();

        let textures: glTexture[] = [];
        for (let name in this.texture_data_) {
            let texture = this.texture_data_[name];
            let source = this.image_files_.indexOf(texture.source);
            if (source >= 0) {
                textures.push(new glTexture(name, texture.sampler, source));
            }
        }

        let output = {
            textures: textures.map(texture => texture.toGLTF()),
            images: this.image_files_.map(uri => ({ uri })),
            samplers: [ new glSampler().toGLTF() ]
        };
        return output;
    };

    getTextureInput() {
        let file_path = this.input_dir_ + "textures.json";
        let data = fs.readFileSync(file_path, "utf8");
        this.texture_data_ = JSON.parse(data);
    };

    getImageFileList() {
        this.image_files_ = fs.readdirSync(this.images_dir_)
            .filter(file => image_file_pattern.test(file));
    };
}