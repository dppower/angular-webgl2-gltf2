"use strict";

import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as fs from "fs";
import * as bodyparser from "body-parser";

//import { gltfBuilder } from "./glTF-builder";
//import { glBuffer } from "./gl-objects/gl-buffer";

//let gltf = new gltfBuilder();
//gltf.initialiseGLTFObject("test-scene-1").subscribe(
//    null,
//    null,
//    () => {
//        let buffer_id = "plane";
//        let array_buffer = gltf.gltf.buffers[buffer_id].buffer;
//        let array = new Float32Array(array_buffer);
//        console.log(`${buffer_id} bytelength: ${array.byteLength}.`);
//        for (let i = 0; i < array.byteLength / 4; i += 8) {
//            console.log(array.subarray(i, i + 8));
//        };
//        //fs.writeFile(path.join(__dirname, "gltf.json"), gltf.toJSON(), (err) => { });
//    }
//);
//createSceneObject("test-scene-1").then(result => {
//    //console.log(result);
//});
//for (let id in scene.programs) {
//    console.log(scene.programs[id].attributes);
//}

//fs.readFile("game-data/vertex-data/cube_low.glb", (err, data) => {
//    if (err) {
//        console.log(err.message); return;
//    }
//    let array = new Float32Array(data.buffer);
//    array.forEach(val => console.log(val));
//    console.log(data.byteLength);
//    console.log(array.length);
//});
var app = express();

app.use(express.static(path.join(__dirname, "..")));
app.use("/scripts", express.static(path.join(__dirname, "..", "..", "node_modules")));
app.use("/vertex-data", express.static(path.join(__dirname, "..", "..", "docs", "vertex-data")));
app.use("/images", express.static(path.join(__dirname, "..", "..", "docs", "images")));
app.use("/shaders", express.static(path.join(__dirname, "..", "..", "docs", "shaders")));

//app.use("/textures", express.static(path.join(__dirname, "..", "textures")));

//app.use(morgan("dev"));

app.set("port", process.env.PORT || 3000);

//var static_scene_objects;
//const game_data_path = path.join(__dirname, "..", "game-data");
 
//app.get("/static-scene-objects", (req, res) => {
//    if (!static_scene_objects) {
//        fs.readFile(path.join(__dirname, "..", "game-data", "render-object-lists", "static-objects.json"), "utf8", (err, data) => {
//            if (err) throw err;
//            static_scene_objects = JSON.parse(data);
//            res.json(static_scene_objects);
//        });
//    } else {
//        console.log("read from cache");
//        res.json(static_scene_objects);
//    }
//});

//app.get("/lights", (req, res) => {
//    let file_path = path.join(__dirname, "..", "game-data", "light-data", "scene-lights.json")
//    fs.readFile(file_path, "utf8", (err, data) => {
//        if (err) throw err;
//        static_scene_objects = JSON.parse(data);
//        res.json(static_scene_objects);
//    });
//});

//app.get("/vertex-data/:fileName", (req, res) => {
//    let fileName = req.params.fileName;
//    let filePath = path.join(__dirname, "..", "game-data", "vertex-data", fileName + ".json");
//    console.log(filePath);
//    fs.readFile(filePath, "utf8", (err, data) => {
//        if (err) throw err;
//        var obj = JSON.parse(data);
//        res.json(obj);
//    });
//});

//app.get("/textures/:fileName", (req, res) => {
//    let fileName = req.params.fileName;
//    let filePath = path.join(__dirname, "..", "game-data", "textures", fileName);
//    console.log(filePath);
//    fs.readFile(filePath, (err, data) => {
//        if (err) throw err;
//        res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
//        res.end(data);
//    });
//});

app.get("*", (request, response) => {
    console.log(__dirname);
    response.sendFile(path.join(__dirname, "..", "index.html"));
});

const server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Example app is listening on port ' + app.get('port'));
    console.log(__dirname);
});