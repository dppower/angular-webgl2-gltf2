import {Component} from "@angular/core";
import {CanvasFrameComponent} from "./canvas-frame.component";
import {ResizableCanvasComponent} from "./resizable-canvas.component";

@Component({
    selector: "app-component",
    template: `
    <canvas-frame>
        <resizable-canvas></resizable-canvas>
    </canvas-frame>
    `,
    directives: [CanvasFrameComponent, ResizableCanvasComponent]
})
export class AppComponent { }