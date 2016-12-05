import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { Webgl2Context } from "./webgl2-context.directive";

@NgModule({
    imports: [ HttpModule ],
    declarations: [ Webgl2Context ],
    exports: [ Webgl2Context ]
})
export class Webgl2Module { };