import { OpaqueToken } from "@angular/core";

import { ObjectBuffer } from "./object-buffer";
import { Transform } from "./transform";
import { ShaderProgram } from "./shader-program";
import { Vec3 } from "./vec3";

export abstract class RenderObject {

    get id() {
        return this.token_.toString();
    };

    get transform() {
        return this.transform_;
    };

    private transform_: Transform;
    

    constructor(private token_: OpaqueToken, private object_buffer_: ObjectBuffer, position = new Vec3(0.0, 0.0, 0.0)) { };

    initObject() { };
    
    drawObject(gl: WebGL2RenderingContext, camera: Camera, shader_program: ShaderProgram) {
        // Contains all the vertex data for this object
        this.object_buffer_.bindVertexArray();


    };
};