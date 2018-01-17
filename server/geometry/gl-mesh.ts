import { glObject } from "../gl-object";
//import { glAccessor, AttributeType } from "./gl-accessor";
//import { glBuffer } from "./gl-buffer";
//import { glBufferView } from "./gl-buffer-view";
import { glPrimitive } from "./gl-primitive";
import { gl } from "../gl-constants";

                                                                                                                                                            

//interface MeshAttributes {   
//    position: glAccessor,
//    normal?: glAccessor,
//    texcoords?: glAccessor,
//    color?: glAccessor,
//    tangent?: glAccessor,
//    bitangent?: glAccessor
//};



//export interface MeshData {
//    [primitive_id: string]: {
//        size: number,
//        attributes: AttributeSemantics[],
//        // buffer_uri: string, // Not needed mesh and binary file share same name
//        // material_id: string // Need to work out a good mechanic to bind these.
//    }
//};

export class glMesh extends glObject {

    // Primitives represent subparts of mesh with distinct materials
    //primitives: { [id: string]: MeshPrimitive } = {};

    // All primitives of same mesh share a buffer:
    //private buffer: glBuffer;

    //constructor(public mesh_id: string, mesh_data: MeshData) {
    constructor(public name: string, public readonly primitives: glPrimitive[]) {
        super(name);
        // All primitives of same mesh share a buffer:
        //let id = this.mesh_id
        //let uri = "./game-data/vertex-data/" + id + ".glb";
        //this.buffer = new glBuffer(id, uri);

        // For each object in mesh-data create a mesh primitive
        //for (let id in mesh_data) {
        //    let length = this.getBufferViewLength(mesh_data[id].attributes, mesh_data[id].size);
        //    let view = new glBufferView(id, this.buffer, 0, length);
        //    let mesh_primitive = new MeshPrimitive(id, mesh_data[id].attributes, view, mesh_data[id].size);
        //    this.primitives[id] = mesh_primitive;
        //    console.log(`mesh_data id: ${id}, primitive: ${mesh_primitive.attributes["POSITION"].id}.`);
        //}
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

    //getAccessors() {
    //    let accessors: { [id: string]: glAccessor } = {}
    //    for (let id in this.primitives) {
    //        console.log(`get accessors, id: ${id}.`);
    //        let primitive = this.primitives[id];
    //        let indices = primitive.indices;
    //        if (indices) {
    //            accessors[indices.id] = indices;
    //        }
    //        for (let attrib in primitive.attributes) {
    //            let accessor = primitive.attributes[attrib];
    //            if (accessor) {
    //                accessors[accessor.id] = accessor;
    //            }
    //        }
    //    }
    //    return accessors;
    //};

    //getBufferViews() {
    //    let views: { [id: string]: glBufferView } = {}
    //    for (let id in this.primitives) {
    //        let primitive = this.primitives[id]
    //        views[primitive.buffer_view.id] = primitive.buffer_view;          
    //    }
    //    return views;
    //};

    //createBuffer() {
    //    return this.buffer.loadBinaryData();
    //};

    ///**
    // * Calculate the length of a buffer-view in bytes,
    // * which can be referenced by multiple assessors of a single primitive.
    // * @param attribs
    // * @param vertex_count
    // */
    //getBufferViewLength(attribs: AttributeSemantics[], vertex_count: number) {
    //    let byteLength = 0;
    //    attribs.forEach((attrib) => {
    //        byteLength += (MeshAttributes[attrib].stride * vertex_count);
    //    });
    //    return byteLength;
    //};

    toGLTF() {
        let glTF = {
            primitives: this.primitives.map(primitive => primitive.toGLTF()),
            name: this.name
        };
        for (let id in this.primitives) {
            glTF.primitives.push(this.primitives[id]);
        }
        return glTF;
    };
};