import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { of as rxOf } from "rxjs/observable/of";

Injectable()
export class BufferLoader {

    getBuffer(buffer_index: number) {
        return this.buffer_cache_[buffer_index];
    };

    private buffer_cache_: ArrayBuffer[];

    constructor(private http_client_: HttpClient, private gltf_data_: glTF) { };

    loadBuffer(buffer_index: number) {
        let buffer = this.buffer_cache_[buffer_index];
        if (buffer) {
            return rxOf(buffer);
        }

        let uri = this.gltf_data_.buffers[buffer_index].uri;

        if (typeof uri === "string") {
            let scheme = uri.split(";");
            if (scheme[0] === "data:application/octet-stream") {
                let data = uri.split(",")[1];
                let is_base_64 = scheme[1].split(",")[0] === "base64";
                let array = this.decodeDataURI(data, is_base_64);
                return rxOf(array.buffer);
            }
            else {
                return this.http_client_.get(uri, { responseType: "arraybuffer" });
            }
        }
        else {
            // Access buffer contained in .glb file
        }
    };

    decodeDataURI(data: string, is_base_64: boolean) {
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
}