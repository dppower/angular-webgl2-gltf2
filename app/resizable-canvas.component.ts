import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, NgZone} from "@angular/core";
import {WebGLContextService} from "./webgl-context";
import {WebGLProgramService} from "./webgl-program";
import {FragmentShader} from "./fragment-shader";
import {VertexShader} from "./vertex-shader";
import {Camera} from "./game-camera";
import {Cube} from "./cube";

@Component({
    selector: 'resizable-canvas',
    template: `
    <canvas #canvas id="canvas" 
        [width]="getCanvasWidth()" 
        [height]="getCanvasHeight()" 
        [style.width]="canvasWidth" 
        [style.height]="canvasHeight" 
        [style.top]="canvasTop" 
        [style.left]="canvasLeft"
    ><p>{{fallbackText}}</p></canvas>
    `,
    styles: [`
    #canvas {
        position: absolute;
        z-index: 0;
    }
    `],
    providers: [WebGLContextService, WebGLProgramService, FragmentShader, VertexShader, Camera, Cube]
})
export class ResizableCanvasComponent implements OnDestroy {
    @ViewChild("canvas") canvasRef: ElementRef;
    
    fallbackText: string = "Loading Canvas...";

    // TODO If the client could change resolution, the binding to canvas height and width (dimensions of drawing buffer),
    // would be different to the style.height and style.width of the canvas.
    canvasWidth: number;
    canvasHeight: number;
    canvasTop: string;
    canvasLeft: string;

    cancelToken: number;

    constructor(private context_: WebGLContextService, private program_: WebGLProgramService, private cube_: Cube, private zone_: NgZone, private camera_: Camera) { };
    
    getCanvasWidth() {
        let width = this.canvasWidth > 1920 ? 1920 : this.canvasWidth;
        return width;
    };

    getCanvasHeight() {
        let height = this.canvasHeight > 1080 ? 1080 : this.canvasHeight;
        return height;
    };


    ngAfterViewInit() {
        let gl = this.context_.create(this.canvasRef.nativeElement);
        
        if (gl) {
            this.program_.initWebGl();
            this.cube_.initialise(this.context_.get);
            this.zone_.runOutsideAngular(() => {
                this.cancelToken = requestAnimationFrame(() => {
                    this.mainloop();
                });
            });
        }
        else {
            console.log("Unable to initialise WebGL.");
            setTimeout(() => {
                this.fallbackText = "Unable to initialise WebGL."
            }, 0);
        }
    }

    mainloop() {
        this.cancelToken = requestAnimationFrame(() => {
            this.mainloop();
        });

        let timeNow = window.performance.now();
        this.dt_ += (timeNow - this.previousTime_); 
        while (this.dt_ > this.timeStep_) {
            this.cube_.update(this.timeStep_);
            this.dt_ -= this.timeStep_;
        }
        this.draw(this.dt_);
        this.previousTime_ = timeNow;
    };


    draw(dt: number) {
        let gl = this.context_.get;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Use the viewport to display all of the buffer
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        // Aspect depends on the display size of the canvas, not drawing buffer.
        let aspect = this.canvasWidth / this.canvasHeight;
        this.camera_.aspect = aspect;

        gl.uniformMatrix4fv(this.program_.uView, false, this.camera_.getvMatrix(5.0));

        gl.uniformMatrix4fv(this.program_.uProjection, false, this.camera_.pMatrix);

        this.cube_.draw(this.program_, gl);
    };

    ngOnDestroy() {
        cancelAnimationFrame(this.cancelToken);
        this.program_.dispose();
    }

    private previousTime_: number = 0;
    private timeStep_: number = 1000 / 60.0;
    private dt_: number = 0;
}