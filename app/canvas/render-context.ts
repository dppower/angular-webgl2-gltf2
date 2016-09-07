import { Injectable, OpaqueToken } from "@angular/core";
import { MainCanvas } from "./main-canvas.component";

@Injectable()
export class RenderContext {   
    get context() { return this.render_context; };

    private main_canvas: MainCanvas;
    private supported_extensions: string[];
    private enabled_extensions = new Map<string, boolean>();
    private render_context: WebGL2RenderingContext;

    constructor() { };

    createContext(html_canvas: HTMLCanvasElement, main_canvas_component: MainCanvas) {
        this.main_canvas = main_canvas_component;
        this.render_context = html_canvas.getContext("webgl2");
        if (this.render_context) {
            this.setExtensionAvailabilty();
        }
    };

    onContextLost(event: WebGLContextEvent) {
        event.preventDefault();
        console.log("context lost");
    };

    onContextRestored(event: WebGLContextEvent) {
        event.preventDefault();
        // cancel animation loop 
        // cancelRequestAnimationFrame(token)
        console.log("context restored");
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

export const webgl2 = new OpaqueToken("webgl2");
export const webgl2_extensions = ["OES_texture_float_linear"]

