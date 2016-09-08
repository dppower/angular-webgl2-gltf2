import { Directive, ElementRef, Host, OpaqueToken, HostListener, OnInit, ReflectiveInjector } from "@angular/core";

import { MainCanvas } from "./main-canvas.component";
import { shader_providers } from "../shaders/shader-program.module";
import { MainCamera } from "../game-engine/main-camera";
import { cube_provider } from "../vertex-data/cubes";
import { InputManager, InputState } from "../game-engine/input-manager";
import { SceneRenderer } from "../renderers/scene-renderer";
import { PixelTargetRenderer } from "../renderers/pixel-target-renderer";
import { AtmosphereModel } from "../renderers/atmosphere-model";
import { webgl2 } from "./webgl2-token";

const webgl2_extensions = ["OES_texture_float_linear"]

@Directive({
    selector: "[canvas-context]"
})
export class Webgl2Context {   
    get gl() { return this.render_context; };
    
    private supported_extensions: string[];
    private enabled_extensions = new Map<string, boolean>();
    private render_context: WebGL2RenderingContext;
    private context_injector: ReflectiveInjector;

    private scene_renderer: SceneRenderer;
    private pixel_target_renderer: PixelTargetRenderer;
    private atmosphere_model: AtmosphereModel;

    constructor(private canvas_ref: ElementRef) { };

    createContext() {
        let html_canvas = (<HTMLCanvasElement>this.canvas_ref.nativeElement);
        this.render_context = html_canvas.getContext("webgl2");
        if (this.render_context) {

            this.setExtensionAvailabilty();
            webgl2_extensions.forEach((extension: string) => {
                this.enableExtension(extension);
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
            return true;
        }
        else {
            console.log("Unable to initialise Webgl2.");
            return false;
        }
    };

    @HostListener("webglcontextlost", ["$event"])
    onContextLost(event: WebGLContextEvent) {
        // cancel animation loop
        // call dispose method on webgl resources.
        console.log("context lost");
        return false;
    };

    @HostListener("webglcontextrestored", ["$event"])
    onContextRestored(event: WebGLContextEvent) {
        if (this.createContext()) {
            // restart canvas loop
        };
        console.log("context restored");
        return false;
    };

    update(dt: number, inputs: InputState, camera: MainCamera, canvas_width, canvas_height) {

        if (inputs.mouseX != 0 && inputs.mouseY != 0) {
            this.pixel_target_renderer.drawOffscreen(camera);
            let mouse_position_x = (inputs.mouseX / canvas_width) * this.pixel_target_renderer.width;
            let mouse_position_y = this.pixel_target_renderer.height - ((inputs.mouseY / canvas_height ) * this.pixel_target_renderer.height);
            this.pixel_target_renderer.getMouseTarget(mouse_position_x, mouse_position_y);
        }
        this.scene_renderer.updateScene(dt, camera);
    };

    draw(camera: MainCamera) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

        //this.atmosphere_model.renderSky(camera);
        this.scene_renderer.drawObjects();
    };

    isExtensionEnabled(extension: string): boolean {
        return this.enabled_extensions.get(extension);
    };

    enableExtension(extension: string) {
        if (this.supported_extensions.findIndex(x => x == extension) != -1) {
            this.render_context.getExtension(extension);
            this.enabled_extensions.set(extension, true);
        }
        else {
            console.log("Webgl extension, " + extension + ", is not supported.");
        }
    };

    private setExtensionAvailabilty() {
        this.supported_extensions = this.render_context.getSupportedExtensions();

        for (let i in this.supported_extensions) {
            this.enabled_extensions.set(this.supported_extensions[i], false);
        }
    };
}

