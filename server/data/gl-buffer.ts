import * as fs from "fs";
import * as path from "path";
import { Observable, Observer } from "rxjs/Rx";
import { gltfObject } from "./gltf-object";

/**
 * The binary data for a mesh primitive.
 */
export class glBuffer extends gltfObject {

    get id() {
        return this.buffer_id;
    };

    get buffer() {
        return this.buffer_.buffer;
    };

    byteLength: number;
    type = "arraybuffer";

    private buffer_: Buffer;
    constructor(private buffer_id, private uri: string) {
        super();
    };

    loadBinaryData() {
        return new Observable<glBuffer>((observer: Observer<glBuffer>) => {
            console.log(this.uri);
            fs.readFile(this.uri, (err, data) => {
                if (err) { observer.error(err.message); }
                this.buffer_ = data;
                this.byteLength = data.byteLength;
                observer.next(this);
                observer.complete();
            });
        });
        //return new Promise<void>((resolve, reject) => {
        //    //let uri = path.join("..", "buffers", file_name);
        //    fs.readFile(this.uri, (err, data) => {
        //        if (err) { reject(err.message); }
        //        this.buffer_ = data;
        //        this.byteLength = data.byteLength;
        //        resolve();
        //    });
        //});
    };

    getDataUri() {
        return "data:application/octet-stream;base64," + this.buffer_.toString("base64");
    };

    toGLTF(as_data_uri = false) {
        let uri = as_data_uri ? this.getDataUri() : this.uri;
        //let glTF = {};
        /*glTF[this.buffer_id] =*/
        return {
            uri,
            byteLength: this.byteLength,
            type: this.type
        }
        //return glTF;
    };
};