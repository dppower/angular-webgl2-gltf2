import { gl } from "../gl-constants";
import { glBuffer } from "./gl-buffer";
import { glObject } from "../gl-object";

/**
 * Provides the interface for gl functions, bindBuffer (target) and
 * bufferData, which uses a Float32Array (offset, length).
 */
export class glBufferView extends glObject {

    get id() {
        return this.buffer_view_id;
    };

    private byteLength: number;

    constructor(
        private buffer_view_id: string,
        private buffer: glBuffer,
        private byteOffset = 0,
        byteLength?: number,
        private target = gl.ARRAY_BUFFER
    ) { 
        super();
        if (byteLength) {
            this.byteLength = byteLength;
        }
        else {
            this.byteLength = this.buffer.byteLength;
        }
    };

    toGLTF() {
        //let glTF = {};
        /*glTF[this.buffer_view_id] = */
        return {
            buffer: this.id,
            byteOffset: this.byteOffset,
            byteLength: this.byteLength,
            target: this.target
        }
        //return glTF;
    };
};