
import {Injectable, provide, OpaqueToken} from "@angular/core";;

type ContextType = "webgl" | "experimental-webgl" | "webgl2" | "experimental-webgl2";

@Injectable()
export class RenderContext<T extends WebGLRenderingContext> {   
    get context() { return this.render_context; };
    
    constructor(public context_type: ContextType) { };

    createContext(canvas: HTMLCanvasElement, context_type: ContextType) {
        this.render_context = (<T>canvas.getContext(context_type));
        if (this.render_context) {
            this.setExtensionAvailabilty();
            return true;
        }
        return false;
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

    private supported_extensions: string[];
    private enabled_extensions = new Map<string, boolean>();
    private render_context: T;
}

let context_factory = (context_type: ContextType, extensions: string[]) => {
    if (context_type == "webgl" || context_type == "experimental-webgl") {
        return () => {
            let context = new RenderContext<WebGLRenderingContext>(context_type);
            for (let i in extensions) {
                context.enableExtension(extensions[i]);
            }
            return context;
        };
    }
    else if (context_type == "webgl2" || context_type == "experimental-webgl2") {
        return () => {
            let context = new RenderContext<WebGL2RenderingContext>(context_type);
            for (let i in extensions) {
                context.enableExtension(extensions[i]);
            }
            return context;
        };
    }
};

let get_context = (context_type: ContextType) => {
    if (context_type == "webgl" || context_type == "experimental-webgl") {
        return (render_context: RenderContext<WebGLRenderingContext>) => {
            return render_context.context;
        }
    }
    else if (context_type == "webgl2" || context_type == "experimental-webgl2") {
        return (render_context: RenderContext<WebGL2RenderingContext>) => {
            return render_context.context;
        }
    }
}

export const webgl2 = new OpaqueToken("webgl2");
export const webgl2_context = new OpaqueToken("webgl2-context");
const webgl2_extensions = ["OES_texture_float_linear"]

export const webgl2_providers = [
    provide(webgl2, {
        useFactory: context_factory("experimental-webgl2", webgl2_extensions)
    }),
    provide(webgl2_context, {
        useFactory: get_context("experimental-webgl2"),
        deps: [webgl2]
    })
];

export const webgl = new OpaqueToken("webgl");
export const webgl_context = new OpaqueToken("webgl-context");
const webgl_extensions = ["OES_texture_float", "OES_texture_float_linear", "WEBGL_color_buffer_float"]

export const webgl_providers = [
    provide(webgl, {
        useFactory: context_factory("webgl", webgl_extensions)
    }),
    provide(webgl_context, {
        useFactory: get_context("webgl"),
        deps: [webgl]
    })
];
