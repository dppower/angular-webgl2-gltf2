import {Injectable} from "angular2/core";
import {WebGLContextService} from "./webgl-context";

@Injectable()
export class FragmentShader {
    constructor(private context_: WebGLContextService) { };

    getShader() {
        let gl = this.context_.get;
        this.shader_ = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.shader_, this.source_);
        gl.compileShader(this.shader_);

        if (!gl.getShaderParameter(this.shader_, gl.COMPILE_STATUS)) {
            return null;
        }
        return this.shader_; 
    };

    private source_: string = `
    void main(void) {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    }
    `;

    private shader_: WebGLShader;
}