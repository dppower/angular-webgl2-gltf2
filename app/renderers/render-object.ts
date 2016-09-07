import { OpaqueToken } from "@angular/core";

import { ObjectBuffer } from "./object-buffer";
import { Transform, Vec3, Quaternion, Mat4 } from "./transform";
import { ShaderProgram } from "./shader-program";
import { Color } from "./color";

export interface RenderObjectData {
    name: string;
    position: Vec3;
    rotation: Quaternion;
    mesh_id: string;
    uniform_color: Color
};

export class RenderObject {

    get id() { return this.id_; };

    get vertex_count() { return this.object_buffer_.vertex_count; };

    get position() { return this.transform_.position; };

    //set uniform_color(color: Float32Array) {
    //    this.uniform_color_.set(color);
    //};

    set roughness(value: number) {
        this.roughness_[0] = (value < 0) ? 0 : ((value > 1.0) ? 1.0 : value);
    };

    set metallic(value: number) {
        this.metallic_[0] = (value < 0) ? 0 : ((value > 1.0) ? 1.0 : value);
    };

    // Uniforms
    get transform_matrix_() { return this.transform_.transform; };
    private roughness_ = new Float32Array(1);
    private metallic_ = new Float32Array(1);
    private uniform_color_ : Color;
    private view_matrix_ = new Mat4();
    private inverse_view_matrix_ = new Mat4();
    private projection_matrix_ = new Mat4();
    private normal_matrix_ = new Mat4();

    private id_: string;
    private transform_: Transform;

    constructor(object_data: RenderObjectData, private object_buffer_: ObjectBuffer) {
        this.uniform_color_ = object_data.uniform_color;
        this.id_ = object_data.name;
        this.transform_ = new Transform(object_data.position, object_data.rotation);
    };

    update(view: Mat4, projection: Mat4) {
        this.transform_.update();
        //console.log(`view: ${view.toString()}, projection: ${projection.toString()}.`)
        // Update transformation matrices
        Mat4.multiply(view, this.transform_.transform, this.view_matrix_);
        Mat4.multiply(projection, this.view_matrix_, this.projection_matrix_);

        this.view_matrix_.inverse(this.inverse_view_matrix_);
        this.inverse_view_matrix_.transpose(this.normal_matrix_);
    };

    bindVertexArray() {
        this.object_buffer_.bindVertexArray();
    };

    unbindVertexArray() {
        this.object_buffer_.unbindVertexArray();
    };
    
    setUniforms(gl: WebGL2RenderingContext, shader_program: ShaderProgram) {

        // TODO set uniforms for texture units

        // Upload uniform data
        shader_program.uniform_map.forEach((location, name) => {
            let name_ = name + "_";
            let uniform_property = (<Float32Array | Mat4 | Color>this[name_]);                       
            //console.log(`name: ${name_}, value: ${uniform_property.toString()}.`);
            if (uniform_property) {
                let size = uniform_property.length;
                switch (size) {
                    case 1:
                        gl.uniform1fv(location, (<Float32Array>uniform_property));
                        break;
                    case 4:
                        let array = (<Color>uniform_property).array || (<Float32Array>uniform_property);
                        gl.uniform4fv(location, array);
                        break;
                    case 16:
                        gl.uniformMatrix4fv(location, false, (<Mat4>uniform_property).array);
                        break;
                }
            }
        });
        //console.log("----");
    };
};