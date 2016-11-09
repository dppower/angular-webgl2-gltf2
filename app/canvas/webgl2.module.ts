import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { Webgl2Context } from "./webgl2-context.directive";
import { ResourceLoader } from "./webgl-resource-loader";

@NgModule({
    imports: [ HttpModule ],
    declarations: [ Webgl2Context ],
    exports: [ Webgl2Context ],
    providers: [ ResourceLoader ]
})
export class Webgl2Module { };