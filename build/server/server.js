"use strict";
var express = require("express");
var http = require("http");
var path = require("path");
var fs = require("fs");
var morgan = require("morgan");
//import { Observable } from "rxjs/Rx";
//var express = require("express");
//var http = require("http");
//var path = require("path");
//var morgan = require("morgan");
//var fs = require("fs")
var app = express();
app.use(express.static(path.join(__dirname, "..")));
app.use("/scripts", express.static(path.join(__dirname, "..", "..", "node_modules")));
//app.use("/textures", express.static(path.join(__dirname, "..", "textures")));
app.use(morgan("dev"));
app.set("port", process.env.PORT || 3000);
var static_scene_objects;
app.get("/static-scene-objects", function (req, res) {
    if (!static_scene_objects) {
        fs.readFile(path.join(__dirname, "..", "game-data", "render-object-lists", "static-objects.json"), "utf8", function (err, data) {
            if (err)
                throw err;
            static_scene_objects = JSON.parse(data);
            res.json(static_scene_objects);
        });
    }
    else {
        console.log("read from cache");
        res.json(static_scene_objects);
    }
});
app.get("/vertex-data/:fileName", function (req, res) {
    var fileName = req.params.fileName;
    var filePath = path.join(__dirname, "..", "game-data", "vertex-data", fileName + ".json");
    console.log(filePath);
    fs.readFile(filePath, "utf8", function (err, data) {
        if (err)
            throw err;
        var obj = JSON.parse(data);
        res.json(obj);
    });
});
app.get("/textures/:fileName", function (req, res) {
    var fileName = req.params.fileName;
    var filePath = path.join(__dirname, "..", "game-data", "textures", fileName);
    console.log(filePath);
    fs.readFile(filePath, function (err, data) {
        if (err)
            throw err;
        res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
        res.end(data);
    });
});
app.get("*", function (request, response) {
    console.log(__dirname);
    response.sendFile(path.join(__dirname, "..", "index.html"));
});
var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log('Example app is listening on port ' + app.get('port'));
    console.log(__dirname);
});
//# sourceMappingURL=server.js.map