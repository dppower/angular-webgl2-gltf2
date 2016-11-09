///<reference path="C:/Program Files (x86)/Microsoft SDKs/TypeScript/1.8/lib.es6.d.ts" />
///<reference path="./webgl2.d.ts" />

import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app.module";

//enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);