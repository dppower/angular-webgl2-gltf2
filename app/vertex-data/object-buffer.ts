import { Inject, Injectable } from "@angular/core"

import { webgl2 } from "../canvas/webgl2-token";
import { ShaderProgram } from "../shaders/shader-program";
import { AttributeLayout } from "../shaders/attribute-layout";
import { VertexData } from "./vertex-data";

@Injectable()
export class ObjectBuffer {

    get name() { return this.name_; };
    get vertex_count() { return this.vertex_count_; };

    private name_: string;
    private vertex_count_: number;
    private vertex_array_object: WebGLVertexArrayObject;
    private vertex_position_buffer: WebGLBuffer;
    private vertex_normal_buffer: WebGLBuffer;
    private vertex_color_buffer: WebGLBuffer;
    private texture_coordinates_buffer: WebGLBuffer;

    constructor(@Inject(webgl2) private gl: WebGL2RenderingContext) { };

    initVertexArray(vertex_data: VertexData) {
        this.vertex_count_ = vertex_data.vertex_count;
        this.name_ = vertex_data.name;

        this.vertex_array_object = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vertex_array_object);
        
        this.bufferData(this.vertex_position_buffer, vertex_data.vertex_positions);
        this.enableAttribute(AttributeLayout.vertex_position);
        
        if (vertex_data.vertex_normals) {
            this.bufferData(this.vertex_normal_buffer, vertex_data.vertex_normals);
            this.enableAttribute(AttributeLayout.vertex_normal);
        }

        if (vertex_data.vertex_colors) {
            this.bufferData(this.vertex_color_buffer, vertex_data.vertex_colors);
            this.enableAttribute(AttributeLayout.vertex_color);
        }

        if (vertex_data.texture_coordinates) {
            this.bufferData(this.texture_coordinates_buffer, vertex_data.texture_coordinates);
            this.enableAttribute(AttributeLayout.texture_coordinates);
        }

        this.gl.bindVertexArray(null);
    };


    bindVertexArray() {

        this.gl.bindVertexArray(this.vertex_array_object);
    };


    unbindVertexArray() {

        this.gl.bindVertexArray(null);
    };


    enableAttribute(layout: number) {

        this.gl.enableVertexAttribArray(layout);
        this.gl.vertexAttribPointer(layout, 3, this.gl.FLOAT, false, 0, 0);
    };


    bufferData(buffer_id: WebGLBuffer, data: number[]) {

        buffer_id = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer_id);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    };
};