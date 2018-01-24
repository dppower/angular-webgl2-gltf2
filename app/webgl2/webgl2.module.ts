import { NgModule } from "@angular/core";

// Directive
import { Webgl2Directive } from "./webgl2.directive";

// Providers
import { GLTFLoader } from "./scene-loader";

@NgModule({
    declarations: [ Webgl2Directive ],
    providers: [ GLTFLoader ],
    exports: [ Webgl2Directive ]
})
export class Webgl2Module { };