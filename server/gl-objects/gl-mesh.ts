import { gltfObject } from "./gltf-object";
import { glAccessor, AttributeType } from "./gl-accessor";
import { glBuffer } from "./gl-buffer";
import { glBufferView } from "./gl-buffer-view";
import * as gl from "./gl-constants";

//enum DrawMode {
//    POINTS = 0x0000,
//    LINES = 0x0001,
//    LINE_LOOP = 0x0002,
//    LINE_STRIP = 0x0003,
//    TRIANGLES = 0x0004,
//    TRIANGLE_STRIP = 0x0005,
//    TRIANGLE_FAN = 0x0006
//};

type DrawMode = "POINTS" | "LINES" | "LINE_LOOP" | "LINE_STRIP" | "TRIANGLES" | "TRIANGLE_STRIP" | "TRIANGLE_FAN";                                                                                                                                                             

//interface MeshAttributes {   
//    position: glAccessor,
//    normal?: glAccessor,
//    texcoords?: glAccessor,
//    color?: glAccessor,
//    tangent?: glAccessor,
//    bitangent?: glAccessor
//};
type AttributeSemantics = "POSITION" | "NORMAL" | "TEXCOORD" | "COLOR";
const MeshAttributes: { [semantic in AttributeSemantics]: {componentType:number, type:AttributeType, stride:number} } = {
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
    "TEXCOORD": {
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

class MeshPrimitive extends gltfObject {
    mode: number;
    material = "test";
    indices: glAccessor; // If using indices, assessor must have byteStride = 0, componentType = unsigned byte or short, type = "SCALAR".
    attributes: {[type in AttributeSemantics]: glAccessor };

    constructor(private primitive_id: string, attribs: AttributeSemantics[], public buffer_view: glBufferView, attribute_count: number, draw_mode: DrawMode = "TRIANGLES") {
        super();
        this.mode = gl[draw_mode];
        
        let byte_stride = 0;
        attribs.forEach((attrib) => {
            byte_stride += MeshAttributes[attrib].stride;
        });
        let byte_offset = 0;
        //this.attributes = { };
        this.attributes = { "POSITION": null, "NORMAL": null, "TEXCOORD": null, "COLOR": null };
        attribs.forEach((attrib) => {
            let id = this.primitive_id + "_" + attrib;        
            this.attributes[attrib] = new glAccessor(id, buffer_view, byte_offset, byte_stride, attribute_count, MeshAttributes[attrib].type);
            byte_offset += MeshAttributes[attrib].stride;
        });
    };

    toGLTF() {
        //let object = {};
        /*object[this.primitive_id]*/ 
        let object = {
            attributes: {},
            material: this.material,
            mode: this.mode
        }
        for (let i in this.attributes) {
            if (this.attributes[i]) {
                object.attributes[i] = this.attributes[i].id;
            }
        }
        if (this.indices) {
            object["indices"] = this.indices.id;
        }
        return object;
    };
};

export interface MeshData {
    [primitive_id: string]: {
        size: number,
        attributes: AttributeSemantics[],
        // buffer_uri: string, // Not needed mesh and binary file share same name
        // material_id: string // Need to work out a good mechanic to bind these.
    }
};

export class glMesh extends gltfObject {

    // Primitives represent subparts of mesh with distinct materials
    primitives: { [id: string]: MeshPrimitive } = {};

    // All primitives of same mesh share a buffer:
    private buffer: glBuffer;

    constructor(public mesh_id: string, mesh_data: MeshData) {
        super();
        // All primitives of same mesh share a buffer:
        let id = this.mesh_id
        let uri = "./game-data/vertex-data/" + id + ".glb";
        this.buffer = new glBuffer(id, uri);

        // For each object in mesh-data create a mesh primitive
        for (let id in mesh_data) {
            let length = this.getBufferViewLength(mesh_data[id].attributes, mesh_data[id].size);
            let view = new glBufferView(id, this.buffer, 0, length);
            let mesh_primitive = new MeshPrimitive(id, mesh_data[id].attributes, view, mesh_data[id].size);
            this.primitives[id] = mesh_primitive;
            console.log(`mesh_data id: ${id}, primitive: ${mesh_primitive.attributes["POSITION"].id}.`);
        }
        // 1: Load and create all buffers:
        //for (let id in mesh_data) {
        //    let uri = ""; //mesh_data[id].buffer_uri;
        //    // All primitives of same mesh share a buffer:
        //    let buffer = new glBuffer(id, uri);
        //    buffer.loadBinaryData("").then((result) => {
        //        // 2: if there is only one primitive then the bufferview uses all the buffer:

        //        let buffer_views: glBufferView[] = []
        //        if (Object.keys(mesh_data).length = 1) {
        //            buffer_views.push(new glBufferView(id, buffer, 0, buffer.byteLength));
        //        } else {
        //            // Need to create a view for each primitive:
        //            let length = this.getBufferViewLength(mesh_data[id].attributes, mesh_data[id].size);
        //            buffer_views.push(new glBufferView(id, buffer, 0, length));
        //        }
        //        buffer_views.forEach((view) => {
        //            let mesh_primitive = new MeshPrimitive(id, mesh_data[id].attributes, view, mesh_data[id].size);
        //            this.primitives[id] = mesh_primitive;
        //        });
        //    });

        //}
    };

    getAccessors() {
        let accessors: { [id: string]: glAccessor } = {}
        for (let id in this.primitives) {
            console.log(`get accessors, id: ${id}.`);
            let primitive = this.primitives[id];
            let indices = primitive.indices;
            if (indices) {
                accessors[indices.id] = indices;
            }
            for (let attrib in primitive.attributes) {
                let accessor = primitive.attributes[attrib];
                if (accessor) {
                    accessors[accessor.id] = accessor;
                }
            }
        }
        return accessors;
    };

    getBufferViews() {
        let views: { [id: string]: glBufferView } = {}
        for (let id in this.primitives) {
            let primitive = this.primitives[id]
            views[primitive.buffer_view.id] = primitive.buffer_view;          
        }
        return views;
    };

    createBuffer() {
        return this.buffer.loadBinaryData();
    };

    /**
     * Calculate the length of a buffer-view in bytes,
     * which can be referenced by multiple assessors of a single primitive.
     * @param attribs
     * @param vertex_count
     */
    getBufferViewLength(attribs: AttributeSemantics[], vertex_count: number) {
        let byteLength = 0;
        attribs.forEach((attrib) => {
            byteLength += (MeshAttributes[attrib].stride * vertex_count);
        });
        return byteLength;
    };

    toGLTF() {
        //let glTF = {};
        //glTF["meshes"] = {}
        /*glTF["meshes"][this.mesh_id]*/ let glTF = {
            primitives: []
        };
        for (let id in this.primitives) {
            glTF.primitives.push(this.primitives[id]);
        }
        return glTF;
    };
};