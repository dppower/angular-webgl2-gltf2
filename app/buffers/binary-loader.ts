import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

Injectable()
export class BinaryLoader {

    private buffer_cache_: ArrayBuffer[];

    constructor(private http_client_: HttpClient, private gltf_data_: glTF) { };

    getBuffer(buffer_index): ArrayBuffer {

        let buffer = this.buffer_cache_[buffer_index];
        if (buffer) {
            return buffer;
        }

        let uri = this.gltf_data_.buffers[buffer_index].uri;

        if (typeof uri === "string") {
            this.http_client_.get(uri, { responseType: "arraybuffer" })
        }
        else {
            // Must be contained in .glb file
        }
    };

}