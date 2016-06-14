import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, NgZone, Inject} from "@angular/core";
import {RenderContext} from "./render-context";
import {SHADER_PROVIDERS, DIFFUSE_SHADER, ShaderProgram, SKYBOX_SHADER} from "./shader-program";
import {Camera} from "./game-camera";
import {CUBE_MESH_PROVIDER} from "./cube-mesh";
import {InputManager, InputState} from "./input-manager";
import {Cube, CUBES, CUBE_1, CUBE_2, CUBE_3} from "./cube";
import {Skybox} from "./skybox";

@Component({
    selector: 'main-canvas',
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
    providers: [RenderContext, SHADER_PROVIDERS, Camera, CUBES, Skybox, CUBE_MESH_PROVIDER]
})
export class MainCanvas implements OnDestroy {
    @ViewChild("canvas") canvasRef: ElementRef;
    
    fallbackText = "Loading Canvas...";

    // TODO If the client could change resolution, the binding to canvas height and width (dimensions of drawing buffer),
    // would be different to the style.height and style.width of the canvas.
    canvasWidth: number;
    canvasHeight: number;
    canvasTop: string;
    canvasLeft: string;

    cancelToken: number;

    constructor(
        private context_: RenderContext,
        @Inject(DIFFUSE_SHADER) private program_: ShaderProgram,
        @Inject(SKYBOX_SHADER) private skyboxProgram_: ShaderProgram,
        @Inject(CUBE_1) private cube1: Cube,
        @Inject(CUBE_2) private cube2: Cube,
        @Inject(CUBE_3) private cube3: Cube,
        private skybox_: Skybox,
        private zone_: NgZone,
        private camera_: Camera,
        private inputManager_: InputManager
    ) { };
    
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
            this.context_.initialise();
            this.program_.initialise(gl);
            this.skyboxProgram_.initialise(gl);
            this.cube1.initialise(gl);
            this.cube2.initialise(gl);
            this.cube3.initialise(gl);
            this.skybox_.initialise(gl);
            this.zone_.runOutsideAngular(() => {
                this.cancelToken = requestAnimationFrame(() => {
                    this.update();
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

    update() {
        this.cancelToken = requestAnimationFrame(() => {
            this.update();
        });

        // Aspect depends on the display size of the canvas, not drawing buffer.
        let aspect = this.canvasWidth / this.canvasHeight;
        let inputs = this.inputManager_.inputs;
        inputs.aspect = aspect;
        this.camera_.Update(inputs);

        let timeNow = window.performance.now();
        this.dt_ += (timeNow - this.previousTime_); 
        while (this.dt_ > this.timeStep_) {
            this.cube1.update(this.timeStep_);
            this.cube2.update(this.timeStep_);
            this.cube3.update(this.timeStep_);
            this.dt_ -= this.timeStep_;
        }
        this.draw(this.dt_);
        this.inputManager_.Update();
        this.previousTime_ = timeNow;
    };


    draw(dt: number) {
        let gl = this.context_.get;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Use the viewport to display all of the buffer
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        this.skybox_.draw(this.skyboxProgram_, gl, this.camera_);
        this.cube1.draw(this.program_, gl, this.camera_);
        this.cube2.draw(this.program_, gl, this.camera_);
        this.cube3.draw(this.program_, gl, this.camera_);
    };

    ngOnDestroy() {
        cancelAnimationFrame(this.cancelToken);
        this.program_.dispose();
        this.skyboxProgram_.dispose();
    }

    private previousTime_: number = 0;
    private timeStep_: number = 1000 / 60.0;
    private dt_: number = 0;
}