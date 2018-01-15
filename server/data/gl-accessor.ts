import { glBufferView } from "./gl-buffer-view";
import { gltfObject } from "./gltf-object";
import * as gl from "./gl-constants";

export type AttributeType = "SCALAR" | "VEC2" | "VEC3" | "VEC4" | "MAT2" | "MAT3" | "MAT4";
export const AttributeSize: { [type in AttributeType]: number } = {
    "SCALAR": 1,
    "VEC2": 2,
    "VEC3": 3,
    "VEC4": 4,
    "MAT2": 4,
    "MAT3": 9,
    "MAT4": 16
};

/**
 * Interface class for gl function, vertexAttribPointer (type, stride, offset).
 */
export class glAccessor extends gltfObject {

    get id() {
        return this.accessor_id;
    };

    constructor(
        private accessor_id: string,
        private buffer_view: glBufferView,
        private byteOffset,
        private byteStride = 0, // a value of 0 signifies tightly packed attribute data
        private count, // equal to number of distinct vertices in mesh
        private type: AttributeType,       
        private componentType = gl.FLOAT,       
    ) {
        super();
    };

    toGLTF() {
        //let glTF = {};
        /*glTF[this.accessor_id] =*/
        return {
            bufferView: this.buffer_view.id,
            byteOffset: this.byteOffset,
            byteStride: this.byteStride,
            componentType: this.componentType,
            count: this.count,
            type: this.type
        }
        //return glTF;
    };
};