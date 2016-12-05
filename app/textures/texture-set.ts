import { Injectable } from "@angular/core";

import { Sampler } from "./sampler";
import { ShaderProgram } from "../shaders/shader-program";
import { TextureLoader } from "./texture-loader"
import { Texture2d } from "./texture-2d";
import { Observable } from "rxjs/Rx";

@Injectable()
export class TextureSet {

    constructor(private gl: WebGL2RenderingContext, private loader_: TextureLoader, private texture_name: string, private textures: string[]) { };

    loadTextures() {
        return Observable.from(this.textures).do(texture_name => { console.log(texture_name);}).mergeMap(texture_id => {
            let texture_property_name = texture_id + "_texture";
            console.log(texture_property_name);
            this[texture_property_name] = new Texture2d(this.gl);
            console.log(this.texture_name + texture_id);
            return this.loader_.loadTexture(this.texture_name + texture_id)
                .do(image_data => {
                    console.log(`width: ${image_data.width}, height: ${image_data.height}.`);
                    (<Texture2d>this[texture_property_name]).uploadTextureData(image_data);
                });
        });
    };

    bindSet(sampler: Sampler, program: ShaderProgram) {
        this.textures.forEach((texture_id, index) => {
            let texture_property_name = texture_id + "_texture";
            this.gl.activeTexture(this.gl.TEXTURE0 + index);
            (<Texture2d>this[texture_property_name]).bindTexture();
            sampler.bindSampler(index);
            this.gl.uniform1i(program.getUniform(texture_property_name), index);
        })
    };
};