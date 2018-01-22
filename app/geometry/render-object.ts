import { /*OpaqueToken, */Inject, Injectable } from "@angular/core";

//import { webgl2 } from "../canvas/webgl2-token";
//import { ObjectBuffer } from "./object-buffer";
import { Transform, Vec3, Quaternion, Mat4 } from "../game-engine/transform";
import { ShaderProgram } from "../shaders/shader-program";
//import { Color } from "../game-engine/color";
//import { TextureSet } from "../textures/texture-set";
//import { TextureLoader } from "../textures/texture-loader";
//import { Sampler } from "../textures/sampler";
//import { RenderObjectData } from "./render-object-data";

@Injectable()
export class RenderObject {

    static uniforms = ["uniform_color", "transform_matrix", "view_matrix",
        "projection_matrix", "normal_matrix"
    ];

    //get id() { return this.id_; };
    //get buffer_id() { return this.vertex_buffer.id; };

    get position() { return this.transform_.position; };
    get orientation() { return this.transform_.orientation; };

    // Uniforms
    get transform_matrix() { return this.transform_.transform; };
    //private uniform_color: Color;
    private view_matrix = new Mat4();
    private projection_matrix = new Mat4();
    private normal_matrix = new Mat4();

    private inverse_view_matrix_ = new Mat4();

    //private id_: string;
    private transform_: Transform;
    //private textures_: TextureSet;
    //private sampler_: Sampler;
    //private texture_loaded = false;

    constructor(// @Inject(webgl2) private gl: WebGL2RenderingContext,
    //    loader: TextureLoader, object_data: RenderObjectData,
    //    private vertex_buffer: ObjectBuffer
    ) {
        //if (object_data.uniform_color) {
        //    this.uniform_color = Color.fromArray(object_data.uniform_color);
        //} else {
        //    this.uniform_color = new Color();
        //}
        //this.id_ = object_data.name;
        //this.transform_ = new Transform(Vec3.fromArray(object_data.position), Quaternion.fromArray(object_data.rotation));
        //if (object_data.textures) {
        //    this.textures_ = new TextureSet(this.gl, loader, object_data.texture_name, object_data.textures);
        //    this.textures_.loadTextures().subscribe((value) => { }, (err) => { }, () => { this.texture_loaded = true; });
        //    this.sampler_ = new Sampler(this.gl);
        //    this.sampler_.setSamplerParameters("LINEAR_MIPMAP_LINEAR", "LINEAR", "CLAMP_TO_EDGE");
        //}
    };

    update(view: Mat4, projection: Mat4) {
        this.transform_.updateTransform();
        
        // Update transformation matrices
        Mat4.multiply(view, this.transform_.transform, this.view_matrix);
        Mat4.multiply(projection, this.view_matrix, this.projection_matrix);

        this.view_matrix.inverse(this.inverse_view_matrix_);
        this.inverse_view_matrix_.transpose(this.normal_matrix);
    };

    //beginDraw() {
    //    this.vertex_buffer.bindVertexArray();
    //};

    //finishDraw() {
    //    this.vertex_buffer.unbindVertexArray();
    //};

    //drawObject(program: ShaderProgram) {
    //    if (!this.textures_ || this.texture_loaded) {
    //        this.setTextureUnits(program);
    //        this.setUniforms(program);
    //        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertex_buffer.vertex_count);
    //    }
    //};

    //setTextureUnits(shader_program: ShaderProgram) {
    //    if (this.textures_ && this.texture_loaded) {
    //        this.textures_.bindSet(this.sampler_, shader_program);
    //    }
    //};

    setUniforms(shader_program: ShaderProgram) {
        //RenderObject.uniforms.forEach((name) => {
        //    let uniform_property = (<Mat4 | Color>this[name]);
        //    if (uniform_property) {
        //        shader_program.setUniform(name, uniform_property);
        //    }
        //});
    };
};