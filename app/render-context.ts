import {Injectable} from "@angular/core";

const GL_EXTENSIONS = ["OES_texture_float", "OES_texture_float_linear"];

@Injectable()
export class RenderContext {   
    get get() { return this.renderContext; };
    
    constructor() { }

    createContext (canvas: HTMLCanvasElement) {
        this.renderContext = <WebGLRenderingContext>canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        this.setExtensionAvailabilty();
        for (let i in GL_EXTENSIONS) {
            this.enableExtension(GL_EXTENSIONS[i]);
            console.log(GL_EXTENSIONS[i] + ": " + this.isExtensionEnabled(GL_EXTENSIONS[i]));
        }
        return this.renderContext;
    };

    isExtensionEnabled(extension: string): boolean {
        return this.enabledExtensions.get(extension);
    };

    enableExtension(extension: string) {
        if (this.supportedExtensions.findIndex(x => x == extension) != -1) {
            this.renderContext.getExtension(extension);
            this.enabledExtensions.set(extension, true);
        }
        else {
            console.log("Webgl extension, " + extension + ", is not supported.");
        }
    };

    private setExtensionAvailabilty() {
        this.supportedExtensions = this.renderContext.getSupportedExtensions();

        for (let i in this.supportedExtensions) {
            this.enabledExtensions.set(this.supportedExtensions[i], false);
        }
    };

    private supportedExtensions: string[];
    private enabledExtensions = new Map<string, boolean>();
    private renderContext: WebGLRenderingContext;
}