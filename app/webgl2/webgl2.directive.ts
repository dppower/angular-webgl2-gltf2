import { Directive, ElementRef, HostListener, Injector, StaticProvider } from "@angular/core";

import { MainCanvas } from "../canvas/main-canvas.component";
import { MainCamera } from "../game-engine/main-camera";
//import { ResourceLoader } from "./webgl-resource-loader";
import { InputManager } from "../game-engine/input-manager";
import { SceneRenderer } from "../renderers/scene-renderer";
//import { PixelTargetRenderer } from "../renderers/pixel-target-renderer";
//import { AtmosphereModel } from "../renderers/atmosphere-model";
import { WEBGL2 } from "./webgl2-token";

const webgl2_extensions = ["OES_texture_float_linear"]

@Directive({
    selector: "[wegl2]"
})
export class Webgl2Directive {
    
    get context() { return this.render_context; };
    
    private supported_extensions: string[];
    private enabled_extensions = new Map<string, boolean>();

    private render_context: WebGL2RenderingContext;

    //private context_injector: ReflectiveInjector;

    //private resource_loader_: ResourceLoader;

    private scene_renderer: SceneRenderer;
    //private pixel_target_renderer: PixelTargetRenderer;
    //private atmosphere_model: AtmosphereModel;

    constructor(private canvas_ref: ElementRef, private injector_: Injector) { };

    createContext() {
        let html_canvas = (<HTMLCanvasElement>this.canvas_ref.nativeElement);
        this.render_context = html_canvas.getContext("webgl2");
        if (this.render_context) {

            this.setExtensionAvailabilty();
            webgl2_extensions.forEach((extension: string) => {
                this.enableExtension(extension);
            });

            this.render_context.clearColor(0.7, 0.7, 0.7, 1.0);
            this.render_context.clearDepth(1.0);
            this.render_context.enable(this.render_context.DEPTH_TEST);
            this.render_context.depthFunc(this.render_context.LEQUAL);

            
            
            //this.pixel_target_renderer.createFramebuffer();
            //this.atmosphere_model.preRenderTextures();
            return true;
        }
        else {
            console.log("Unable to initialise Webgl2.");
            return false;
        }
    };

    createWebGLResources() {
        let providers: StaticProvider[] = [
                { provide: WEBGL2, useValue: this.render_context },
                {
            ];

        let injector = Injector.create([gl_provider, ResourceLoader], this.injector_);
        
        //this.resource_loader_ = this.context_injector.get(ResourceLoader);

        //this.resource_loader_.loadResources().subscribe((object) => { }, error => { }, () => {
        //    this.scene_renderer = this.resource_loader_.getResource(SceneRenderer);
        //    this.scene_renderer.start();
        //});
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

    //update(dt: number, camera: MainCamera, canvas_width, canvas_height) {

    //    //this.pixel_target_renderer.getMouseTarget(canvas_width, canvas_height);
    //    if (this.scene_renderer) {
    //        this.scene_renderer.updateScene(dt, camera);
    //    }
    //};

    //draw(camera: MainCamera) {
    //    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    //    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

    //    //this.atmosphere_model.renderSky(camera);
    //    if (this.scene_renderer) {
    //        this.scene_renderer.drawObjects();
    //    }
    //};

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

