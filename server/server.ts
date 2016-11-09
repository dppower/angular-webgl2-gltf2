"use strict";

import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as fs from "fs";
import * as morgan from "morgan";
//var express = require("express");
//var http = require("http");
//var path = require("path");
//var morgan = require("morgan");
//var fs = require("fs")
var app = express();

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "..")));
app.use("/scripts", express.static(path.join(__dirname, "..", "..", "node_modules")));

app.set("port", process.env.PORT || 3000);

var static_scene_objects;

app.get("/static-scene-objects", (req, res) => {
    if (!static_scene_objects) {
        fs.readFile(path.join(__dirname, "..", "render-object-lists", "static-objects.json"), "utf8", (err, data) => {
            if (err) throw err;
            static_scene_objects = JSON.parse(data);
            res.json(static_scene_objects);
        });
    } else {
        console.log("read from cache");
        res.json(static_scene_objects);
    }
});

app.get("/vertex-data/:fileName", (req, res) => {
    let fileName = req.params.fileName;
    let filePath = path.join(__dirname, "..", "vertex-data", fileName + ".json");
    console.log(filePath);
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) throw err;
        var obj = JSON.parse(data);
        res.json(obj);
    });
});

app.get("*", (request, response) => {
    console.log(__dirname);
    response.sendFile(path.join(__dirname, "..", "index.html"));
});

var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Example app is listening on port ' + app.get('port'));
    console.log(__dirname);
});