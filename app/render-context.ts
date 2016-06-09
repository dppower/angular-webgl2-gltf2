import {Injectable} from "@angular/core";

@Injectable()
export class RenderContext {

    get get() { return this.context_; };
    
    constructor() { }

    create (canvas: HTMLCanvasElement) {
        this.context_ = <WebGLRenderingContext>canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        return this.context_;
    };

    initialise() {
        let gl = this.context_;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    };

    private context_: WebGLRenderingContext;
}