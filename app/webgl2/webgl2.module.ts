import { NgModule } from "@angular/core";

// Directive
import { Webgl2Directive } from "./webgl2.directive";

// Providers
import { SceneLoader } from "./scene-loader";
import { BufferLoader } from "./buffer-loader";
import { MaterialLoader } from "../materials/material-loader";

@NgModule({
    declarations: [ Webgl2Directive ],
    providers: [],
    exports: [ Webgl2Directive ]
})
export class Webgl2Module { };