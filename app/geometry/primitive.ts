//import { webgl2 } from "../canvas/webgl2-token";
import { from as rxFrom } from "rxjs/observable/from";
import { tap, mergeMap, toArray } from "rxjs/operators";
import { ShaderProgram } from "../shaders/shader-program";
import { AttributeLayout } from "../shaders/attribute-layout";
import { MaterialLoader } from "../materials/material-loader";
import { Material } from "../materials/material";
import { BufferLoader } from "../webgl2/buffer-loader";
//import { VertexData } from "./vertex-data";

const Size = {
    "SCALAR": 1,
    "VEC2": 2,
    "VEC3": 3,
    "VEC4": 4,
    "MAT2": 4,
    "MAT3": 9,
    "MAT4": 16
};

/**
 * Represents an individual object that can be rendered
 */
export class Primitive {
    //get id() { return this.buffer_id_; };
    //get vertex_count() { return this.vertex_count_; };

    //private buffer_id_: OpaqueToken;
    private vertex_count_: number;
    private vertex_array_object_: WebGLVertexArrayObject;

    /**The index is bufferView.index, and a new WebGLBuffer is created for each view*/
    private vertex_buffers_: { [index: number]: WebGLBuffer } = {};

    //private position_buffer_: WebGLBuffer;
    //private normal_buffer_: WebGLBuffer;
    //private tangent_buffer_: WebGLBuffer;
    //private texcoord_0_buffer_: WebGLBuffer;
    //private texcoord_1_buffer_: WebGLBuffer;
    //private color_0_buffer_: WebGLBuffer;
    private material_: Material;
    private drawing_mode_: number;

    //constructor(@Inject(webgl2) private gl: WebGL2RenderingContext, private buffer_id_: OpaqueToken) { };
    constructor(private gl_context_: WebGL2RenderingContext, private gltf_data_: glTFData,
        private material_loader_: MaterialLoader, private buffer_loader_: BufferLoader,
        private primitive_data_: glTF.Primitive
    ) { };

    loadVertexData() {
        let buffer_indices: number[] = [];
        for (let name in this.primitive_data_.attributes) {
            let accessor_index = this.primitive_data_.attributes[name];
            let accessor = this.gltf_data_.accessors[accessor_index];
            let buffer_view_index = accessor.bufferView;
            let buffer_index = this.gltf_data_.bufferViews[buffer_view_index].buffer;
            buffer_indices.push(buffer_index);
        }
        let unique_buffer_indices = Array.from(new Set(buffer_indices));

        return rxFrom(unique_buffer_indices)
            .pipe(
                mergeMap(buffer_index => this.buffer_loader_.loadBuffer(buffer_index)),
                toArray(),
                tap(buffers => this.initVertexArray(this.primitive_data_))
            );
    };

    loadMaterial() {
        return this.material_loader_.getMaterial(this.primitive_data_.material)
            .pipe(
                tap(material => this.material_ = material)
            );
    };

    initVertexArray(primitive: glTF.Primitive/*vertex_data: VertexData*/) {
        this.drawing_mode_ = primitive.mode || 4;

        this.vertex_array_object_ = this.gl_context_.createVertexArray();
        this.gl_context_.bindVertexArray(this.vertex_array_object_);

        //let layout_index = AttributeLayout.POSITION;
        //let accessor = this.gltf_data_.accessors[primitive.attributes["POSITION"]]
        //this.createBuffer(primitive.attributes["POSITION"]);
        //this.bufferData(this.vertex_buffers_[layout_index], vertex_data.vertex_positions);
        //this.enableAttribute(AttributeLayout["POSITION"], primitive.attributes["POSITION"]);
        let accessor = this.gltf_data_.accessors[primitive.attributes["POSITION"]];
        this.vertex_count_ = accessor.count;

        for (let attribute in primitive.attributes) {
            this.createBuffer(primitive.attributes[attribute]);
            this.enableAttribute(AttributeLayout[attribute], primitive.attributes[attribute]);
        }

        if (!primitive.attributes["NORMAL"]) {
            // TODO: Need to calculate flat normals
        }

        if (!primitive.attributes["TANGENT"]) {
            // TODO: Need to calculate tangents
        }

        //if (primitive.attributes["NORMAL"]) {
        //    this.bufferData(this.vertex_normal_buffer, vertex_data.vertex_normals);
        //    this.enableAttribute(AttributeLayout.NORMAL, 3);
        //}
        //else {
        //    // TODO: Need to calculate flat normals
        //}

        //if (primitive.attributes["TANGENT"]) {
        //    this.bufferData(this.vertex_normal_buffer, vertex_data.vertex_normals);
        //    this.enableAttribute(AttributeLayout.NORMAL, 3);
        //}
        //else {
        //    // TODO: Need to calculate tangents
        //}

        //if (primitive.attributes["TEXCOORD_0"]) {
        //    this.bufferData(this.vertex_uv_buffer, vertex_data.texture_coordinates);
        //    this.enableAttribute(AttributeLayout.TEXCOORD_0, 2);
        //}

        //if (primitive.attributes["TEXCOORD_1"]) {
        //    this.bufferData(this.vertex_uv_buffer, vertex_data.texture_coordinates);
        //    this.enableAttribute(AttributeLayout.TEXCOORD_0, 2);
        //}

        //if (primitive.attributes["COLOR_0"]) {
        //    this.bufferData(this.vertex_color_buffer, vertex_data.vertex_colors);
        //    // Can be Vec3 or Vec4
        //    this.enableAttribute(AttributeLayout.COLOR_0);
        //}

        this.gl_context_.bindVertexArray(null);
    };
    
    createBufferView(buffer_view_index: number) {
        let buffer_view = this.gltf_data_.bufferViews[buffer_view_index];
        let buffer = this.buffer_loader_.getBuffer(buffer_view.buffer);
        return buffer.slice(buffer_view.byteOffset, buffer_view.byteOffset + buffer_view.byteLength);
    };

    //bindVertexArray() {
    //    this.gl_context_.bindVertexArray(this.vertex_array_object);
    //};


    //unbindVertexArray() {
    //    this.gl_context_.bindVertexArray(null);
    //};

    draw(shader: ShaderProgram) {
        this.gl_context_.bindVertexArray(this.vertex_array_object_);
        //set texture units
        this.material_.setMaterialUniforms(shader);
        //set other uniforms
        this.gl_context_.drawArrays(this.drawing_mode_, 0, this.vertex_count_);
        this.gl_context_.bindVertexArray(null);
    };

    enableAttribute(layout: number, accessor_index: number) {
        let accessor = this.gltf_data_.accessors[accessor_index];
        let buffer_view = this.gltf_data_.bufferViews[accessor.bufferView];

        this.gl_context_.enableVertexAttribArray(layout);
        this.gl_context_.vertexAttribPointer(layout,
            Size[accessor.type],
            accessor.componentType,
            accessor.normalized || false,
            buffer_view.byteStride || 0,
            accessor.byteOffset || 0
        );
    };

    createBuffer(accessor_index: number) {
        let accessor = this.gltf_data_.accessors[accessor_index];
        let buffer_view_index = accessor.bufferView;
        let buffer = this.vertex_buffers_[buffer_view_index];
        if (!buffer) {
            buffer = this.gl_context_.createBuffer();
            this.gl_context_.bindBuffer(this.gl_context_.ARRAY_BUFFER, buffer);
            this.bufferData(buffer_view_index);
        }
        this.gl_context_.bindBuffer(this.gl_context_.ARRAY_BUFFER, buffer);
    };

    bufferData(buffer_view_index: number) {
        let data = this.createBufferView(buffer_view_index);
        //buffer_id = this.gl_context_.createBuffer();
        //this.gl_context_.bindBuffer(this.gl_context_.ARRAY_BUFFER, buffer_id);
        this.gl_context_.bufferData(this.gl_context_.ARRAY_BUFFER, data, this.gl_context_.STATIC_DRAW);
    };
};