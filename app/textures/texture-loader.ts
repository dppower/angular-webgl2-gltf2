import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { of as rxOf } from "rxjs/observable/of";
import { concatMap, catchError, tap, map } from "rxjs/operators";

import { Texture2d } from "./texture-2d";
//import { ImageDecoder } from "./image-decoder";

export type TextureData = ImageData | ImageBitmap | Uint8Array;

@Injectable()
export class TextureLoader {

    //readonly date_uri_regex = /^data:([^;]*)(;base64)?,(.*)$/;
    readonly relative_path_regex = /^\.\/([^.]*)(?:bin|jpeg|png)/;
    // Uses the same source index as the gltf
    // Use with texImage2D;
    private texture_data_: glTF.Texture[] = [];

    private texture_cache_: Texture2d[] = [];

    private image_sources_: glTF.Image[] = [];

    private default_texture_: ImageData;

    constructor(private http_client_: HttpClient, private gl: ) { };

    setImageSources(data: glTF.Texture, sources: glTF.Image[]) {
        this.image_sources_ = sources;
        this.clearCache();
        this.loadAll();
    };

    loadAll() {
        this.image_sources_.forEach((source, index) => {
            this.loadTexture(index);
        })
    };

    loadTexture(source: number) {
        let texture = this.texture_cache_[source];

        if (texture) {
            return rxOf(texture);
        }

        let image_source = this.image_sources_[source];
        let uri = image_source.uri;
        if (typeof uri === "string") {
            let scheme = uri.split(";");
            if (scheme[0] === "data:image/png" || scheme[0] === "data:image/jpeg") {
                let data = uri.split(",")[1];
                let is_base_64 = scheme[1].split(",")[0] === "base64";
                this.decodeImageDataURI(data, is_base_64);
            }
            else {

                return this.http_client_.get(image_source.uri, { responseType: "blob" })
                    .pipe(
                    concatMap(blob => {
                        return createImageBitmap(blob);
                    }),
                    map(image => {
                        let texture = new Texture2d(
                    }),
                    tap(image => {
                        this.texture_cache_[source] = image;
                    }),
                    catchError(this.handleError)
                    );
            }
        }
        else if (typeof image_source.bufferView === "number" &&
            (image_source.mimeType === "image/jpeg" || image_source.mimeType === "image/png"))
        {

        }
        else {
            console.warn(`Failed to locate texture: ${JSON.stringify(image_source)}.`); 
            return this.handleError(null);
        }
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
        this.default_texture_ = new ImageData(array, 512, 512);
    };

    handleError(err: any) {
        return rxOf(this.default_texture_);
    };

    clearCache() {
        this.texture_cache_.length = 0;
    };
};