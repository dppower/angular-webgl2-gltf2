import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy} from "angular2/core";

@Component({
    selector: 'resizable-canvas',
    template: `
    <canvas #canvas id="canvas" [width]="canvasWidth" [height]="canvasHeight" [style.top]="canvasTop" [style.left]="canvasLeft"><p>{{fallbackText}}</p></canvas>
    `,
    styles: [`
    #canvas {
        position: absolute;
        z-index: 0;
    }
    `]
})
export class ResizableCanvasComponent implements OnDestroy {
    @ViewChild("canvas") canvasRef: ElementRef;
    
    fallbackText: string = "Loading Canvas...";

    canvasWidth: number;
    canvasHeight: number;
    canvasTop: string;
    canvasLeft: string;

    cancelToken: number;

    ngAfterViewInit() {
        let canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
        this.gl_ = <WebGLRenderingContext>canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        let gl = this.gl_;

        if (gl) {
            this.initShaders(gl);
            this.initBuffers(gl);
            gl.clearColor(0.0, 0.0, 1.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            this.tick(gl);
        }
        else {
            console.log("Unable to initialise WebGL.");
            setTimeout(() => {
                this.fallbackText = "Unable to initialise WebGL."
            }, 0);
        }
    }

    tick(gl: WebGLRenderingContext) {
        this.cancelToken = requestAnimationFrame(() => {
            this.tick(gl);
        });
        gl.viewport(0, 0, this.canvasWidth, this.canvasHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };

    ngOnDestroy() {
        cancelAnimationFrame(this.cancelToken);
    }

    initShaders(gl: WebGLRenderingContext) {
        
    };

    initBuffers(gl: WebGLRenderingContext) {
    };

    private gl_: WebGLRenderingContext;
}