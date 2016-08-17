import { Inject, Injectable } from "@angular/core"

import { webgl2_context } from "./render-context";
import { ShaderProgram } from "./shader-program";
import { Mesh } from "./mesh";

@Injectable()
export class ObjectBuffer {

    private vertex_array_object: WebGLVertexArrayObject;
    private vertex_position_buffer: WebGLBuffer;
    private vertex_normal_buffer: WebGLBuffer;
    private vertex_color_buffer: WebGLBuffer;
    private texture_coordinates_buffer: WebGLBuffer;

    constructor(@Inject(webgl2_context) private gl: WebGL2RenderingContext) { };

    initVertexArray(mesh: Mesh, shader_program: ShaderProgram) {

        this.vertex_array_object = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vertex_array_object);

        for (let i = 0; i < shader_program.attribute_count; i++) {
            this.gl.enableVertexAttribArray(i);
        }

        this.bufferData(this.vertex_position_buffer, mesh.vertex_positions);
        this.gl.vertexAttribPointer(shader_program.getAttribute("vertex_position"), 3, this.gl.FLOAT, false, 0, 0);

        if (mesh.vertex_normals) {
            this.bufferData(this.vertex_normal_buffer, mesh.vertex_normals);
            this.gl.vertexAttribPointer(shader_program.getAttribute("vertex_normal"), 3, this.gl.FLOAT, false, 0, 0);
        }

        if (mesh.vertex_colors) {
            this.bufferData(this.vertex_color_buffer, mesh.vertex_colors);
            this.gl.vertexAttribPointer(shader_program.getAttribute("vertex_color"), 3, this.gl.FLOAT, false, 0, 0);
        }

        if (mesh.texture_coordinates) {
            this.bufferData(this.texture_coordinates_buffer, mesh.texture_coordinates);
            this.gl.vertexAttribPointer(shader_program.getAttribute("texture_coordinates"), 3, this.gl.FLOAT, false, 0, 0);
        }

        this.gl.bindVertexArray(null);
    };

    bindVertexArray() {
        this.gl.bindVertexArray(this.vertex_array_object);
    };

    unbindVertexArray() {
        this.gl.bindVertexArray(null);
    };

    bufferData(buffer_id: WebGLBuffer, data: number[]) {
        buffer_id = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer_id);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    };
};