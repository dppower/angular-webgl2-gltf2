import { Inject, Injectable, Injector, OpaqueToken } from "@angular/core";

import { ShaderType, compileShader, VertexShaderSource, FragmentShaderSource } from "./shader-source";
import { Uint32 } from "../game-engine/uint32";
import { Float32 } from "../game-engine/float32";
import { Vec3, Mat4 } from "../game-engine/transform";
import { Color } from "../game-engine/color";
import { webgl2 } from "../canvas/webgl2-token";

@Injectable()
export class ShaderProgram {

    get attribute_count() { return this.attribute_count_; };

    get uniform_map() { return this.uniforms_; };

    private attribute_count_: number;
    private attributes_= new Map<string, number>();
    private uniforms_ = new Map<string, WebGLUniformLocation>();
    private program_: WebGLProgram;

    constructor(
        @Inject(webgl2) private gl: WebGL2RenderingContext,
        private vertex_shader_source: VertexShaderSource,
        private fragment_shader_source: FragmentShaderSource
    ) { };

    deleteProgram() {
        this.gl.deleteProgram(this.program_);
    };

    getAttribute(name: string): number {
        return this.attributes_.get(name);
    };

    getUniform(name: string): WebGLUniformLocation {
        return this.uniforms_.get(name);
    };

    setUniform(uniform_name: string, uniform_value: any) {
        let uniform_location = this.getUniform(uniform_name);

        if (typeof uniform_value === "boolean") {
            let int = uniform_value ? 1 : 0;
            this.gl.uniform1ui(uniform_location, int);
        }
        else {
            let size = uniform_value.length;
            switch (size) {
                case 1:
                    if (uniform_value instanceof Uint32) {
                        this.gl.uniform1ui(uniform_location, uniform_value.value);
                    }
                    else if (uniform_value instanceof Float32) {
                        this.gl.uniform1f(uniform_location, uniform_value.value);
                    }
                    else {
                        this.gl.uniform1fv(uniform_location, (<Float32Array>uniform_value));
                    }
                    break;
                case 3:
                    let array_3f = (<Vec3>uniform_value).array || (<Float32Array>uniform_value);
                    this.gl.uniform3fv(uniform_location, array_3f);
                    break;
                case 4:
                    let array_4f = (<Color>uniform_value).array || (<Float32Array>uniform_value);
                    this.gl.uniform4fv(uniform_location, array_4f);
                    break;
                case 16:
                    this.gl.uniformMatrix4fv(uniform_location, false, (<Mat4>uniform_value).array);
                    break;
                default:
                    console.log(`Invalid uniform: ${uniform_name}, size: ${size}, uniform_value: ${uniform_value}.`);
            }
        }
    };

    initProgram() {
        let compiled_vertex_shader = compileShader(this.gl, ShaderType.Vertex, this.vertex_shader_source.source);
        let fragShader = compileShader(this.gl, ShaderType.Fragment, this.fragment_shader_source.source);

        this.program_ = this.gl.createProgram();
        this.gl.attachShader(this.program_, compiled_vertex_shader);
        this.gl.attachShader(this.program_, fragShader);
        this.gl.linkProgram(this.program_);

        if (!this.gl.getProgramParameter(this.program_, this.gl.LINK_STATUS)) {
            console.log("Program link error: " + this.gl.getProgramInfoLog(this.program_));

            this.gl.deleteProgram(this.program_);

            this.gl.deleteShader(compiled_vertex_shader);
            this.gl.deleteShader(fragShader);

            alert("Unable to initialize the shader program."); 
        }

        this.gl.detachShader(this.program_, compiled_vertex_shader);
        this.gl.detachShader(this.program_, fragShader);

        this.gl.deleteShader(compiled_vertex_shader);
        this.gl.deleteShader(fragShader);

        this.setAttributeIds(this.gl);
        this.locateUniforms(this.gl);
    };

    useProgram() {
        this.gl.useProgram(this.program_);
        //this.active_attribute_counter.checkAttributeCount(this.attribute_count_, this.gl);
    };

    private locateUniforms(gl: WebGLRenderingContext) {
        this.vertex_shader_source.uniforms.forEach((uniform_name) => {
            let uniform_location = this.gl.getUniformLocation(this.program_, uniform_name);
            this.uniforms_.set(uniform_name, uniform_location);
        });

        this.fragment_shader_source.uniforms.forEach((uniform_name) => {
            let uniform_location = this.gl.getUniformLocation(this.program_, uniform_name);
            this.uniforms_.set(uniform_name, uniform_location);
        });
    };

    private setAttributeCount() {       
        this.attribute_count_ = this.vertex_shader_source.attributes.length;
    };

    private setAttributeIds(gl: WebGLRenderingContext) {
        this.vertex_shader_source.attributes.forEach((attribute_name) => {
            let attrib_id = this.gl.getAttribLocation(this.program_, attribute_name);
            this.attributes_.set(attribute_name, attrib_id);

            this.attribute_count_ = this.attributes_.size;
        });
    };
}
