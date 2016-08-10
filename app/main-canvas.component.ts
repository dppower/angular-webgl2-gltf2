import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, NgZone, Inject} from "@angular/core";
import {RenderContext} from "./render-context";
import {SHADER_PROVIDERS, DIFFUSE_SHADER, ShaderProgram, SKYBOX_SHADER, BASIC_SHADER} from "./shader-program";
import {Camera} from "./game-camera";
import {CUBE_MESH_PROVIDER} from "./cube-mesh";
import {InputManager, InputState} from "./input-manager";
import {CUBES} from "./cube";
import {Skybox} from "./skybox";
import {SceneRenderer} from "./scene-renderer";
import {PickingRenderer} from "./picking-renderer";
import {AtmosphereModel} from "./sky-model";

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
    providers: [RenderContext, SHADER_PROVIDERS, Camera, CUBES, Skybox, CUBE_MESH_PROVIDER, SceneRenderer, PickingRenderer, AtmosphereModel]
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
        @Inject(DIFFUSE_SHADER) private diffuseProgram_: ShaderProgram,
        @Inject(SKYBOX_SHADER) private skyboxProgram_: ShaderProgram,
        private sceneRenderer_: SceneRenderer,
        private pickingRenderer_: PickingRenderer,
        private skybox_: Skybox,
        private atmosphere_: AtmosphereModel, 
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
        let gl = this.context_.createContext(this.canvasRef.nativeElement);
        
        if (gl) {
            this.diffuseProgram_.initialise(gl);
            this.skyboxProgram_.initialise(gl);
            this.sceneRenderer_.Start(gl);
            this.pickingRenderer_.Start();
            //this.skybox_.initialise(gl);
            this.atmosphere_.Start(gl);
            this.zone_.runOutsideAngular(() => {
                this.cancelToken = requestAnimationFrame(() => {
                    this.Update();
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

    Update() {
        this.cancelToken = requestAnimationFrame(() => {
            this.Update();
        });

        // Aspect depends on the display size of the canvas, not drawing buffer.
        let aspect = this.canvasWidth / this.canvasHeight;
        let inputs = this.inputManager_.inputs;
        inputs.aspect = aspect;
        this.camera_.Update(inputs);

        if (inputs.mouseX != 0 && inputs.mouseY != 0) {

            let mousePositionX = (inputs.mouseX / this.canvasWidth) * this.pickingRenderer_.width;
            let mousePositonY = this.pickingRenderer_.height - ((inputs.mouseY / this.canvasHeight) * this.pickingRenderer_.height);
            this.pickingRenderer_.GetMouseTarget(mousePositionX, mousePositonY);
        }

        let timeNow = window.performance.now();
        this.dt_ += (timeNow - this.previousTime_); 
        while (this.dt_ > this.timeStep_) {
            this.sceneRenderer_.UpdateScene(this.timeStep_);
            this.dt_ -= this.timeStep_;
        }
        this.Draw(this.dt_);
        this.inputManager_.Update();
        this.previousTime_ = timeNow;
    };


    Draw(dt: number) {
        let gl = this.context_.get;
        this.pickingRenderer_.DrawOffscreen(this.camera_);
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        this.atmosphere_.RenderSky(gl);
        //this.skybox_.draw(this.skyboxProgram_, this.context_.get, this.camera_);
        this.sceneRenderer_.DrawAll(this.diffuseProgram_, this.camera_);
    };

    ngOnDestroy() {
        cancelAnimationFrame(this.cancelToken);
        this.diffuseProgram_.dispose();
        this.skyboxProgram_.dispose();
    }

    private previousTime_: number = 0;
    private timeStep_: number = 1000 / 60.0;
    private dt_: number = 0;
}