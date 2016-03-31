import {Component, ViewChild, ElementRef, AfterViewInit} from "angular2/core";

@Component({
    selector: 'resizable-canvas',
    template: `
    <canvas #canvas id="canvas" [width]="canvasWidth" [height]="canvasHeight" [style.top]="canvasTop" [style.left]="canvasLeft"></canvas>
    `,
    styles: [`
    #canvas {
        border: 0.25em solid blue;
        position: absolute;
        z-index: 0;
    }
    `]
})
export class ResizableCanvasComponent {
    @ViewChild("canvas") canvasRef: ElementRef;

    canvasWidth: number;
    canvasHeight: number;
    canvasTop: string;
    canvasLeft: string;

}