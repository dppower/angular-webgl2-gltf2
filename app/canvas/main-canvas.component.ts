import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, NgZone, ReflectiveInjector } from "@angular/core";

import { RenderContext, webgl2, webgl2_extensions } from "./render-context";
import { shader_providers } from "../shaders/shader-program";
import { MainCamera } from "../game-engine/main-camera";
import { Vec3 } from "../game-engine/transform";
import { cube_provider } from "../vertex-data/cubes";
import { InputManager, InputState } from "../game-engine/input-manager";
import { SceneRenderer } from "../renderers/scene-renderer";
import { PixelTargetRenderer } from "../renderers/pixel-target-renderer";
import { AtmosphereModel } from "../renderers/atmosphere-model";

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
        (webglcontextlost)="render_context.onContextLost($event)"
        (webglcontextrestored)="render_context.onContextRestored($event)"
    ><p>{{fallbackText}}</p></canvas>
    `,
    styles: [`
    #canvas {
        position: absolute;
        z-index: 0;
    }
    `],
    providers: [RenderContext, MainCamera ]
})
export class MainCanvas implements OnDestroy {
    @ViewChild("canvas") canvas_ref: ElementRef;
    
    fallbackText = "Loading Canvas...";

    canvasWidth: number;
    canvasHeight: number;
    canvasTop: string;
    canvasLeft: string;

    private cancel_token: number;
    private previous_time = 0;
    private time_step = 1000 / 60.0;
    private accumulated_time = 0;

    private gl: WebGL2RenderingContext;
    private context_injector: ReflectiveInjector;
    private scene_renderer: SceneRenderer;
    private pixel_target_renderer: PixelTargetRenderer;
    private atmosphere_model: AtmosphereModel;

    constructor(
        private render_context: RenderContext,
        private ng_zone: NgZone,
        private main_camera: MainCamera,
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
        this.render_context.createContext((<HTMLCanvasElement>this.canvas_ref.nativeElement), this);
        this.gl = this.render_context.context;
        
        if (this.gl) {

            webgl2_extensions.forEach((extension: string) => {
                this.render_context.enableExtension(extension);
            });

            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);

            let gl_provider = { provide: webgl2, useValue: this.gl };
            this.context_injector = ReflectiveInjector.resolveAndCreate([gl_provider, SceneRenderer, cube_provider, shader_providers, PixelTargetRenderer, AtmosphereModel]);

            this.scene_renderer = this.context_injector.get(SceneRenderer);
            this.pixel_target_renderer = this.context_injector.get(PixelTargetRenderer);
            this.atmosphere_model = this.context_injector.get(AtmosphereModel);

            this.scene_renderer.start();
            this.pixel_target_renderer.createFramebuffer();
            this.atmosphere_model.preRenderTextures();

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
        this.main_camera.updateCamera(inputs);

        // Update objects in scene
        let time_now = window.performance.now();
        this.accumulated_time += (time_now - this.previous_time); 
        while (this.accumulated_time > this.time_step) {
            this.scene_renderer.updateScene(this.time_step, this.main_camera);
            this.accumulated_time -= this.time_step;
        }

        // Find the target if mouse-click
        if (inputs.mouseX != 0 && inputs.mouseY != 0) {
            this.pixel_target_renderer.drawOffscreen(this.main_camera);
            let mouse_position_x = (inputs.mouseX / this.canvasWidth) * this.pixel_target_renderer.width;
            let mouse_position_y = this.pixel_target_renderer.height - ((inputs.mouseY / this.canvasHeight) * this.pixel_target_renderer.height);
            this.pixel_target_renderer.getMouseTarget(mouse_position_x, mouse_position_y);
        }

        this.input_manager.Update();
        this.previous_time = time_now;

        // Draw scene
        this.Draw();
    };

    Draw() {
                
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

        this.atmosphere_model.renderSky(this.main_camera);
        this.scene_renderer.drawObjects();
    };

    ngOnDestroy() {
        cancelAnimationFrame(this.cancel_token);
    }
}