import { Injectable, provide, OpaqueToken } from "@angular/core";;
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

//let context_factory = (extensions: string[]) => {

//    return () => {
//        let context = new RenderContext();
//        for (let i in extensions) {
//            console.log(`i: ${i}, value: ${extensions[i]}.`);
//            context.enableExtension(extensions[i]);
//        }
//        return context;
//    };
//};

//let get_context = () => {
//    return (render_context: RenderContext) => {
//        return render_context.render_context;
//    }
//}

export const webgl2 = new OpaqueToken("webgl2");
export const webgl2_extensions = ["OES_texture_float_linear"]

export const webgl2_providers = [
    //provide(RenderContext, {
    //    useFactory: context_factory(webgl2_extensions)
    //}),
    RenderContext,
    //{
    //    provide: webgl2,
    //    useFactory: get_context(),
    //    deps: [RenderContext]
    //}
];
