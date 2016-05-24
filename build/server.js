var express = require("express");
var http = require("http");
var path = require("path");
var morgan = require("morgan");

var app = express();

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname)));
app.use("/scripts", express.static(path.join(__dirname, "../node_modules")));

app.set("port", process.env.PORT || 3000);

app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "./index.html"));
});

var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Example app is listening on port ' + app.get('port'));
});