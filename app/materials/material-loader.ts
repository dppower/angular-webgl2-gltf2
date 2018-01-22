import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { of as rxOf } from "rxjs/observable/of";
import { from as rxFrom } from "rxjs/observable/from";
import { concatMap, catchError, tap, map, toArray, take } from "rxjs/operators";

import { Material } from "./material";
import { Texture2d } from "./texture-2d";
import { Sampler } from "./sampler";
//import { ImageDecoder } from "./image-decoder";

export type TextureData = ImageData | ImageBitmap | Uint8Array;

@Injectable()
export class MaterialLoader {

    getMaterial(material_index: number) {
        return this.loadTexturesForMaterial(material_index)
            .pipe(
                take(1),
                map(textures => {
                    let material = new Material(this.gl_context_, this.gltf_data_, this);
                    material.setTextures(material_index);
                    return material;
                })
            );
    };

    // index is from material
    getTexture(texture_index: number) {
        let texture = this.gltf_data_.textures[texture_index];
        if (texture) {
            let source_index = texture.source;            
            return this.texture_cache_[source_index];
        }
        return this.default_texture_;
    };

    getSampler(texture_index: number) {
        let texture = this.gltf_data_.textures[texture_index];
        if (texture) {
            let sampler_index = texture.sampler;
            if (sampler_index) {
                return this.samplers_[sampler_index];
            }
        }
        return this.default_sampler_;
    };

    //readonly date_uri_regex = /^data:([^;]*)(;base64)?,(.*)$/;
    readonly relative_path_regex = /^([^.]*)(?:\.)(?:jpeg|png)/;

    private samplers_: Sampler[];
    private default_sampler_: Sampler;

    private texture_cache_: Texture2d[] = [];
    private default_texture_: Texture2d;

    constructor(private http_client_: HttpClient,
        private gl_context_: WebGL2RenderingContext,
        private gltf_data_: glTFData
    ) {
        this.createDefaultTexture();
        this.createDefaultSampler();
        this.createSamplers();
    };

    loadTexturesForMaterial(material_index: number) {
        let material = this.gltf_data_.materials[material_index];
        let texture_indices = [
            material.pbrMetallicRoughness && material.pbrMetallicRoughness.baseColorTexture,
            material.pbrMetallicRoughness && material.pbrMetallicRoughness.metallicRoughnessTexture,
            material.normalTexture, material.occulsionTexture, material.emissiveTexture
        ].filter(texture => !!texture).map(texture => texture.index);

        return rxFrom(texture_indices)
            .pipe(
                map(texture_index => this.gltf_data_.textures[texture_index].source),
                concatMap(source => {
                    return this.loadTexture(source);
                }),
                toArray()
            );
    };

    preloadAllTextures() {
        this.clearCache();
        return rxFrom(this.gltf_data_.images)
            .pipe(
                concatMap((source, index) => {
                    return this.loadTexture(index);
                })
                //toArray(),
                //tap(textures => {
                //    this.texture_cache_ = textures;
                //})
            );
    };

    loadTexture(index: number) {
        let texture = this.texture_cache_[index];
        if (texture) {
            return rxOf(texture);
        }

        let image_source = this.gltf_data_.images[index];
        let uri = image_source.uri;
        if (typeof uri === "string") {
            let scheme = uri.split(";");
            if (scheme[0] === "data:image/png" || scheme[0] === "data:image/jpeg") {
                let data = uri.split(",")[1];
                let is_base_64 = scheme[1].split(",")[0] === "base64";
                let array = this.decodeImageDataURI(data, is_base_64);

                let texture = new Texture2d(this.gl_context_);
                texture.uploadTextureData(array);

                this.texture_cache_[index] = texture;

                return rxOf(texture);
            }
            else {
                if (this.relative_path_regex.test(uri)) {
                    return this.http_client_.get(uri, { responseType: "blob" })
                        .pipe(
                            concatMap(blob => {
                                return createImageBitmap(blob);
                            }),
                            map(image => {
                                let texture = new Texture2d(this.gl_context_);
                                texture.uploadTextureData(image);
                                return texture;
                            }),
                            tap(texture => {
                                this.texture_cache_[index] = texture;
                            }),
                            catchError(this.handleError)
                        );
                }
                else {
                    console.warn(`Invalid image uri: ${JSON.stringify(image_source)}.`);
                    return this.handleError(null);
                }
            }
        }
        else if (typeof image_source.bufferView === "number" &&
            (image_source.mimeType === "image/jpeg" || image_source.mimeType === "image/png")
        ) {
            // TODO get image from bufferView
            return this.handleError(null);
        }
        else {
            console.warn(`Failed to locate texture: ${JSON.stringify(image_source)}.`); 
            return this.handleError(null);
        }
    };

    createSamplers() {
        this.samplers_ = this.gltf_data_.samplers.map((data, index) => {
            let sampler = new Sampler(this.gl_context_);
            sampler.setParametersFromData(data);
            return sampler;
        });
    };

    decodeImageDataURI(data: string, is_base_64: boolean) {
        let decoded_text = decodeURIComponent(data);
        let byte_string = decoded_text;
        if (is_base_64) {
            byte_string = atob(decoded_text);
        }
        let array = new Uint8Array(byte_string.length);
        for (let i = 0; i < byte_string.length; i++) {
            array[i] = byte_string.charCodeAt(i);
        }
        return array;
    };
    
    * createPattern() {
        const row_size = 512;
        const section = row_size / 8;

        for (let row = 0; row < row_size; row++) {
            let offset = (Math.trunc(row / section) % 2);
            for (let count = 0; count < row_size; count++) {
                let color;
                if (offset) {
                    color = 255 * (Math.trunc(count / section) % 2);
                }
                else {
                    color = 255 * ((1 + Math.trunc(count / section)) % 2);
                }

                for (let i = 0; i < 3; i++) {
                    yield color;
                }
                yield 255;
            }
        }
    };

    createDefaultTexture() {
        let array = new Uint8ClampedArray(this.createPattern());
        let image_data = new ImageData(array, 512, 512);
        this.default_texture_ = new Texture2d(this.gl_context_);
        this.default_texture_.uploadTextureData(image_data);
    };

    createDefaultSampler() {
        this.default_sampler_ = new Sampler(this.gl_context_);
        this.default_sampler_.setParameters("LINEAR_MIPMAP_LINEAR", "LINEAR", "CLAMP_TO_EDGE");
    };

    handleError(err: any) {
        return rxOf(this.default_texture_);
    };

    clearCache() {
        this.texture_cache_.length = 0;
    };
};