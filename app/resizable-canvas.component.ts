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
    
    //context: CanvasRenderingContext2D;
    gl: WebGLRenderingContext;

    canvasWidth: number;
    canvasHeight: number;
    canvasTop: string;
    canvasLeft: string;

    ngAfterViewInit() {
        let canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
        this.gl = canvas.getContext("experimental-webgl");

        if (this.gl) {
            this.gl.clearColor(0.0, 0.0, 1.0, 1.0);
            this.tick();
        }
        else {
            console.log("Unable to initialise context.");
        }
    }

    tick() {
        requestAnimationFrame(() => {
            this.tick();
        });
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        //this.context.fillStyle = "rgba(0, 0, 200, 1)";
        //this.context.fillRect(20, 20, 400, 400);
    };

}