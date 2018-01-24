import { Directive, ElementRef, HostListener/*, Injector, StaticProvider*/ } from "@angular/core";

import { Subscription } from "rxjs/Subscription";
import { GLTFLoader } from "./scene-loader";
import { MainCamera } from "../game-engine/main-camera";
//import { ResourceLoader } from "./webgl-resource-loader";
import { InputManager } from "../game-engine/input-manager";
import { RenderLoop } from "../game-engine/render-loop";
import { SceneRenderer } from "../renderers/scene-renderer";
//import { PixelTargetRenderer } from "../renderers/pixel-target-renderer";
//import { AtmosphereModel } from "../renderers/atmosphere-model";
//import { WEBGL2 } from "./webgl2-token";

const WEBGL2_EXTENSIONS = ["OES_texture_float_linear"]

@Directive({
    selector: "[webgl2]"
})
export class Webgl2Directive {
    
    //get context() { return this.render_context; };
    
    private supported_extensions: string[];
    private enabled_extensions = new Map<string, boolean>();

    private render_context: WebGL2RenderingContext;

    //private context_injector: ReflectiveInjector;
    //private resource_loader_: ResourceLoader;

    private scene_renderer_: SceneRenderer;
    //private pixel_target_renderer: PixelTargetRenderer;
    //private atmosphere_model: AtmosphereModel;

    private update_sub_: Subscription;
    private render_sub_: Subscription;

    constructor(private canvas_ref_: ElementRef, private gltf_loader_: GLTFLoader,
        private render_loop_: RenderLoop/*, private injector_: Injector*/
    ) { };

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

    createContext() {
        let html_canvas = (<HTMLCanvasElement>this.canvas_ref_.nativeElement);
        this.render_context = html_canvas.getContext("webgl2");
        if (this.render_context) {

            this.setExtensionAvailabilty();
            WEBGL2_EXTENSIONS.forEach((extension: string) => {
                this.enableExtension(extension);
            });

            this.render_context.clearColor(0.7, 0.7, 0.7, 1.0);
            this.render_context.clearDepth(1.0);
            this.render_context.enable(this.render_context.DEPTH_TEST);
            this.render_context.depthFunc(this.render_context.LEQUAL);
           
            //this.pixel_target_renderer.createFramebuffer();
            //this.atmosphere_model.preRenderTextures();
            this.gltf_loader_.fetchGLTFData("test-scene.gltf", this.render_context).subscribe(
                (result) => {
                    this.scene_renderer_ = this.gltf_loader_.getItem(SceneRenderer);
                    this.begin();
                }
            )
            return true;
        }
        else {
            console.log("Unable to initialise Webgl2.");
            return false;
        }
    };

    begin() {
        this.scene_renderer_.constructScene();
        this.update_sub_ = this.render_loop_.update_events
            .subscribe((dt) => {
                this.update(dt);
            });

        this.render_sub_ = this.render_loop_.render_events
            .subscribe((factor) => {
                this.draw();
            });

        this.render_loop_.begin();
    };

    update(dt: number/*, camera: MainCamera, canvas_width, canvas_height*/) {
        this.scene_renderer_.updateScene(dt);
    //    //this.pixel_target_renderer.getMouseTarget(canvas_width, canvas_height);
    //    if (this.scene_renderer) {
    //        this.scene_renderer.updateScene(dt, camera);
    //    }
    };

    draw(/*camera: MainCamera*/) {
        this.render_context.clear(this.render_context.COLOR_BUFFER_BIT | this.render_context.DEPTH_BUFFER_BIT);
        this.render_context.viewport(
            0, 0, this.render_context.drawingBufferWidth, this.render_context.drawingBufferHeight
        );

        this.scene_renderer_.drawObjects();
    //    //this.atmosphere_model.renderSky(camera);
    //    if (this.scene_renderer) {
    //        this.scene_renderer.drawObjects();
    //    }
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

    ngOnDestroy() {
        this.render_loop_.stop();
        this.update_sub_ && this.update_sub_.unsubscribe();
        this.render_sub_ && this.render_sub_.unsubscribe();
    };
}

