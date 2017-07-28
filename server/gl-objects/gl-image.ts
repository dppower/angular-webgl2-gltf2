import * as fs from "fs";
import * as path from "path";
import { Observable, Observer } from "rxjs/Rx";
import { gltfObject } from "./gltf-object";

export class glImage extends gltfObject {

    get id() {
        return this.image_id;
    };

    private buffer_: Buffer;

    constructor(private image_id, private uri: string) {
        super();
    };

    readImageData() {
        return new Observable<glImage>((observer: Observer<glImage>) => {
            fs.readFile(this.uri, (err, data) => {
                if (err) { observer.error(err.message); }
                this.buffer_ = data;
                observer.next(this);
                observer.complete();
            });
        });
    };

    getDataUri() {
        return "data:application/octet-stream;base64," + this.buffer_.toString("base64");
    };

    toGLTF(as_data_uri = false) {
        let uri = as_data_uri ? this.getDataUri() : this.uri;
        return {
            uri
        }
    };
};