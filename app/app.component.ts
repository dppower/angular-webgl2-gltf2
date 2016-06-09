import {Component} from "@angular/core";
import {CanvasController} from "./canvas-controller.component";
import {MainCanvas} from "./main-canvas.component";

@Component({
    selector: "app-component",
    template: `
    <canvas-controller>
        <main-canvas></main-canvas>
    </canvas-controller>
    `,
    directives: [CanvasController, MainCanvas]
})
export class AppComponent { }