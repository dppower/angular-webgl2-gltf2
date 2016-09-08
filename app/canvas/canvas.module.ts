import { NgModule } from "@angular/core";

import { Webgl2Module } from "./webgl2.module";
import { CanvasController } from "./canvas-controller.component";
import { MainCanvas } from "./main-canvas.component";
import { CanvasFrame } from "./canvas-frame.directive";

@NgModule({
    imports: [Webgl2Module],
    declarations: [ MainCanvas, CanvasController, CanvasFrame ],
    exports: [ MainCanvas, CanvasController ]
})
export class CanvasModule { };