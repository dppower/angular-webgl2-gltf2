import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy} from "angular2/core";
import {WebGLContextService} from "./webgl-context";
import {WebGLProgramService} from "./webgl-program";
import {FragmentShader} from "./fragment-shader";
import {VertexShader} from "./vertex-shader";
import {Camera} from "./game-camera";
import {GameObject} from "./game-object";

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
    `],
    providers: [WebGLContextService, WebGLProgramService, FragmentShader, VertexShader, Camera, GameObject]
})
export class ResizableCanvasComponent implements OnDestroy {
    @ViewChild("canvas") canvasRef: ElementRef;
    
    fallbackText: string = "Loading Canvas...";

    canvasWidth: number;
    canvasHeight: number;
    canvasTop: string;
    canvasLeft: string;

    cancelToken: number;

    constructor(private context_: WebGLContextService, private program_: WebGLProgramService) { };

    ngAfterViewInit() {
        let gl = this.context_.create(this.canvasRef.nativeElement);
        
        if (gl) {
            this.program_.initWebGl();
            this.tick();
        }
        else {
            console.log("Unable to initialise WebGL.");
            setTimeout(() => {
                this.fallbackText = "Unable to initialise WebGL."
            }, 0);
        }
    }

    tick() {
        let timeNow = window.performance.now();
        let dt = timeNow - this.previousTime_; 
        this.cancelToken = requestAnimationFrame(() => {
            this.tick();
        });
        this.program_.draw(dt, this.canvasWidth, this.canvasHeight);
        this.previousTime_ = timeNow;
    };

    ngOnDestroy() {
        cancelAnimationFrame(this.cancelToken);
    }

    private previousTime_: number = 0;

}