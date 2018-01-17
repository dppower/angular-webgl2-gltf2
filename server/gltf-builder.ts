//"use strict"
//import * as path from "path";
//import * as fs from "fs";
//import * as gl from "./gl-objects/gl-constants";
//import { gltfObject } from "./gl-objects/gltf-object";
//import { MeshData, glMesh } from "./gl-objects/gl-mesh";
//import { glAccessor } from "./gl-objects/gl-accessor";
//import { glBuffer } from "./gl-objects/gl-buffer";
//import { glBufferView } from "./gl-objects/gl-buffer-view";
//import { Observable, Observer } from "rxjs/Rx";

//interface glTF {
//    nodes: {},
//    scenes: {},
//    scene?: string,
//    meshes: { [id: string]: glMesh },
//    accessors: { [id: string]: glAccessor },
//    buffers: { [id: string]: glBuffer },
//    bufferViews: { [id: string]: glBufferView }
//    //textures: {},
//    //images: {},
//    //samplers: {},
//    //materials: {},
//    //techniques: { [id: string]: Technique },
//    //programs: { [id: string]: Program },
//    //shaders: { [id: string]: Shader }
//};

//interface glTFRoot {
//    nodes: {},
//    scenes: {},
//    scene: string,
//    meshes: { [id: string]: MeshData }
//};

////interface Technique {
////    parameters: {},
////    attributes: {},
////    program: string,
////    uniforms: {},
////    states: TechniqueStates,
////    name: string,
////    extensions?: {},
////    extras?: any
////};

////interface TechniqueStates {
////    enable: number[];
////    functions: {};
////    extensions?: {},
////    extras?: any
////}

////interface StateFunctions {
////    blendColor: number[];
////    blend
////    extensions?: {},
////    extras?: any
////}

////interface Program {
////    attributes: string[],
////    fragmentShader: string,
////    vertexShader: string,
////    name: string,
////    extensions?: {},
////    extras?: any
////};

////interface ShaderSource {
////    name: string,
////    type: number,
////    attributes: string[],
////    uniforms: string[],
////    source: string
////};

////interface Shader {
////    uri: string,
////    type: number,
////    name: string,
////    extensions?: {},
////    extras?: any
////};

////var program_source: { [id: string]: Program } = require("../game-data/programs.json");
////var shader_source: { [id: string]: ShaderSource } = require("../game-data/shader-source.json");

////var programs: { [id: string]: Program } = require("../game-data/programs.json");

////function createShadersObject() {
////    let shaders: { [shader_id: string]: Shader } = {};

////    for (let id in shader_source) {
////        let source = shader_source[id];
////        let uri = id + ".glsl";

////        let shader: Shader = Object.assign({}, {
////            uri,
////            type: source.type,
////            name: id
////        });
////        shaders[id] = shader;
////    }
////    return shaders;
////};

////function getProgramAttributes(vertex_shader_name: string) {
////    return shader_source[vertex_shader_name].attributes;
////};

////function createProgramsObject() {
////    let programs: { [program_id: string]: Program } = {};
////    for (let id in program_source) {
////        let attribute_array = getProgramAttributes(program_source[id].vertexShader);

////        let program = Object.assign({}, {
////            attributes: attribute_array,
////            name: id
////        }, program_source[id]);
        
////        programs[id] = program;
////    }
////    return programs;
////};

////export function createSceneObject(scene_name: string) {
////    let scene_json_file = path.join("game-data", scene_name + ".json");
////    console.log(scene_json_file);
////    return new Promise((resolve, reject) => {
////        fs.readFile(scene_json_file, "utf8", (err, data) => {
////            if (err) reject(err.message);
////            let scene_data: glTFRoot = JSON.parse(data);
////            for (let id in scene_data.meshes) {
////                let mesh_data = scene_data.meshes[id].extras;
////                let mesh = new glMesh(id, mesh_data);
////                let out_string = JSON.stringify(mesh.toGLTF());
////                console.log(out_string);
////            };
////            resolve(scene_data);
////        });
////    })
////    //let materials = {};
////    //let techniques = {};
////    //let shaders = createShadersObject();
////    //let programs = createProgramsObject();
////    //let glTFObject: glTF = Object.assign({}, {
////    //    materials,
////    //    techniques,
////    //    shaders,
////    //    programs
////    //})

////    //return glTFObject;
////}

//export class gltfBuilder {

//    gltf: glTF;

//    constructor() {

//    };

//    initialiseGLTFObject(scene_name: string) {
//        this.gltf = {
//            nodes: {},
//            scene: "",
//            scenes: {},
//            meshes: {},
//            buffers: {},
//            bufferViews: {},
//            accessors: {}
//        };

//        return this.getglTFRoot(scene_name).do((root_data) => {
//            this.gltf.scene = root_data.scene;
//            this.gltf.scenes = root_data.scenes;
//            this.gltf.nodes = root_data.nodes;
//            //let meshes_loaded: Promise<void>[] = [];
//            //for (let id in root_data.meshes) {
//            //    meshes_loaded.push(this.loadMeshes(id, root_data.meshes[id].extras));
//            //}
//            //return Promise.all(meshes_loaded);
//        }).mergeMap((root_data) => {
//            let meshes: glMesh[] = []
//            for (let id in root_data.meshes) {
//                let mesh_data = root_data.meshes[id];
//                let mesh = new glMesh(id, mesh_data);
//                meshes.push(mesh);
                
//                this.gltf.meshes[id] = mesh;
//                console.log(`mesh id: ${mesh.mesh_id}.`);
//                this.gltf.accessors = Object.assign(this.gltf.accessors, mesh.getAccessors());
//                this.gltf.bufferViews = Object.assign(this.gltf.bufferViews, mesh.getBufferViews());
//                //meshes_loaded.push(this.loadMeshes(id, root_data.meshes[id].extras));
//            }
//            return Observable.from(meshes);
//        }).mergeMap(mesh => {

//            return mesh.createBuffer();

//            }).do(buffer => {
//                this.gltf.buffers[buffer.id] = buffer;
//        });
//    };

//    getDefaultScene() {
//        return this.gltf.scene;
//    };

//    getglTFRoot(file_name: string) {
//        let scene_json_file = path.join("game-data", file_name + ".json");
//        return new Observable<glTFRoot>((observer: Observer<glTFRoot>) => {
//            fs.readFile(scene_json_file, "utf8", (err, data) => {
//                if (err) observer.error(err.message);
//                let scene_data: glTFRoot;
//                try {
//                    scene_data = JSON.parse(data);
//                } catch (err) {
//                    let error: SyntaxError = err;
//                    observer.error(error.message);
//                }
//                observer.next(scene_data);
//                observer.complete();
//            });
//        });

//        //return new Promise<glTFRoot>((resolve, reject) => {
//        //    fs.readFile(scene_json_file, "utf8", (err, data) => {
//        //        if (err) reject(err.message);
//        //        let scene_data: glTFRoot = JSON.parse(data);
//        //        resolve(scene_data);
//        //    });
//        //});
//    };

//    toJSON() {
//        return JSON.stringify(this.gltf, (key, value) => {
//            if (value instanceof gltfObject) {
//                return value.toGLTF();
//            }
//            return value;
//        });
//    };

//    loadMeshes(id: string, mesh_data: MeshData) {
//        let mesh = new glMesh(id, mesh_data);
//        return mesh.createBuffer();
//        //for (let id in scene_data.meshes) {
//        //    let mesh_data = scene_data.meshes[id].extras;
//        //    let mesh = new glMesh(id, mesh_data);
//        //    let out_string = JSON.stringify(mesh.toGLTF());
//        //    console.log(out_string);
//        //};
//    };
//};
