(function(global) {
    var map = {
        "@angular": "scripts/@angular",
        "rxjs": "scripts/rxjs"
    };

    var packages = {
        "app": { main: "main.js", defaultExtension: "js" },
        "rxjs": { defaultExtension: "js" }
    };

    var ngPackageName = [
        "common", "compiler", "core", "platform-browser", "platform-browser-dynamic", "http", "router"
    ];

    ngPackageName.forEach((name) => {
        packages["@angular/" + name] = { main: name + ".umd.js", defaultExtension: "js" };
    })

    var config = {
        map,
        packages
    }

    System.config(config);

})(this);