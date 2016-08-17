import {
    Component,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnDestroy,
    NgZone,
    Inject
} from "@angular/core";

import { RenderContext, webgl2_providers, webgl2, webgl2_context } from "./render-context";
import { ShaderProgram, shader_providers } from "./shader-program";
import { Camera } from "./game-camera";
import { CubeMesh } from "./cube-mesh";
import { InputManager, InputState } from "./input-manager";
import { SceneRenderer } from "./scene-renderer";
import { PixelTargetRenderer } from "./pixel-target-renderer";
import { AtmosphereModel } from "./sky-model";

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
    providers: [webgl2_providers, shader_providers, Camera, CubeMesh, SceneRenderer, PixelTargetRenderer, AtmosphereModel]
})
export class MainCanvas implements OnDestroy {
    @ViewChild("canvas") canvas_ref: ElementRef;
    
    fallbackText = "Loading Canvas...";

    canvasWidth: number;
    canvasHeight: number;
    canvasTop: string;
    canvasLeft: string;

    cancel_token: number;

    constructor(
        @Inject(webgl2) private render_context: RenderContext<WebGL2RenderingContext>,
        @Inject(webgl2_context) private gl: WebGL2RenderingContext,       
        private scene_renderer: SceneRenderer,
        private pixel_target_renderer: PixelTargetRenderer,
        private atmosphere_model: AtmosphereModel, 
        private ng_zone: NgZone,
        private main_camera: Camera,
        private input_manager: InputManager
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
        let is_context_created = this.render_context.createContext((<HTMLCanvasElement>this.canvas_ref.nativeElement), "experimental-webgl2");
        
        if (is_context_created) {
            this.scene_renderer.Start();
            this.pixel_target_renderer.Start();
            this.atmosphere_model.Start();

            this.ng_zone.runOutsideAngular(() => {
                this.cancel_token = requestAnimationFrame(() => {
                    this.update();
                });
            });
        }
        else {
            console.log("Unable to initialise Webgl2.");
            setTimeout(() => {
                this.fallbackText = "Unable to initialise Webgl2."
            }, 0);
        }
    }

    update() {
        this.cancel_token = requestAnimationFrame(() => {
            this.update();
        });

        // Aspect depends on the display size of the canvas, not drawing buffer.
        let aspect = this.canvasWidth / this.canvasHeight;
        let inputs = this.input_manager.inputs;
        inputs.aspect = aspect;
        this.main_camera.Update(inputs);

        if (inputs.mouseX != 0 && inputs.mouseY != 0) {
            let mouse_position_x = (inputs.mouseX / this.canvasWidth) * this.pixel_target_renderer.width;
            let mouse_position_y = this.pixel_target_renderer.height - ((inputs.mouseY / this.canvasHeight) * this.pixel_target_renderer.height);
            this.pixel_target_renderer.getMouseTarget(mouse_position_x, mouse_position_y);
        }

        let time_now = window.performance.now();
        this.accumulated_time += (time_now - this.previous_time); 
        while (this.accumulated_time > this.time_step) {
            this.scene_renderer.updateScene(this.time_step);
            this.accumulated_time -= this.time_step;
        }
        this.Draw(this.accumulated_time);
        this.input_manager.Update();
        this.previous_time = time_now;
    };


    Draw(dt: number) {
        this.pixel_target_renderer.drawOffscreen(this.main_camera);
        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

        this.atmosphere_model.renderSky(this.gl);
        this.scene_renderer.drawAll(this.main_camera);
    };

    ngOnDestroy() {
        cancelAnimationFrame(this.cancel_token);
    }

    private previous_time = 0;
    private time_step = 1000 / 60.0;
    private accumulated_time = 0;
}