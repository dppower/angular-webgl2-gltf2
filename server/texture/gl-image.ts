import fs = require("fs");
import path = require("path");
import util = require("util");
import { glObject } from "../gl-object";

const readFile = util.promisify(fs.readFile);

export class glImage extends glObject {
    
    private buffer_: Buffer;
    private data_uri_: string;
    
    constructor(name: string, public readonly uri: string,
        private bufferView?: number, private mimeType?: "image/png" | "image/jpeg"
    ) {
        super(name);
    };

    readImageData() {
        return readFile(this.uri).then(buffer => this.buffer_ = buffer);
    };

    setDataUri() {
        this.data_uri_ = "data:application/octet-stream;base64," + this.buffer_.toString("base64");
    };

    toGLTF(as_data_uri = false) {
        let uri = as_data_uri ? this.data_uri_ : this.uri;
        return {
            uri
        }
    };
};