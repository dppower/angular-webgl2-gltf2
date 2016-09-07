(function(global) {
    var map = {
        "rxjs": "scripts/rxjs"
    };

    var ngBundles = [
        "common", "compiler", "core", "platform-browser", "platform-browser-dynamic", "http", "router", "forms"
    ];

    ngBundles.forEach((name) => {
        map["@angular/" + name] = "scripts/@angular/" + name + "/bundles/" + name + ".umd.js";
    })

    var packages = {
        "app": { main: "./main.js", defaultExtension: "js" },
        "rxjs": { defaultExtension: "js" }
    };

    var config = {
        map,
        packages
    }

    System.config(config);

})(this);