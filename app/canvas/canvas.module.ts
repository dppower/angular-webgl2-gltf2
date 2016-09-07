import { NgModule } from "@angular/core";

import { CanvasController } from "./canvas-controller.component";
import { MainCanvas } from "./main-canvas.component";
import { CanvasFrame } from "./canvas-frame.directive";

@NgModule({
    declarations: [ MainCanvas, CanvasController, CanvasFrame ],
    exports: [ MainCanvas, CanvasController ]
})
export class CanvasModule { };