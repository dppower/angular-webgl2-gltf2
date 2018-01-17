import { glBufferView } from "./gl-buffer-view";
import { glObject } from "../gl-object";
import { gl } from "../gl-constants";

const MeshAttributes: {[id:string /*in Attribute*/]: { componentType: number, type: AttributeType, stride: number } } = {
    "POSITION": {
        componentType: gl.FLOAT,
        type: "VEC3",
        stride: 12
    },
    "NORMAL": {
        componentType: gl.FLOAT,
        type: "VEC3",
        stride: 12
    },
    "TANGENT": {
        componentType: gl.FLOAT,
        type: "VEC3",
        stride: 12
    },
    "TEXCOORD_0": {
        componentType: gl.FLOAT,
        type: "VEC2",
        stride: 8
    },
    "COLOR": {
        componentType: gl.UNSIGNED_BYTE,
        type: "SCALAR",
        stride: 1
    }
};

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
export class glAccessor extends glObject {

    get id() {
        return this.accessor_id;
    };

    constructor(
        private accessor_id: string,
        private buffer_view: glBufferView,
        private byteOffset: number,
        private byteStride = 0, // a value of 0 signifies tightly packed attribute data
        private count: number, // equal to number of distinct vertices in mesh
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