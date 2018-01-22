import { Injectable, Inject/*, OpaqueToken*/ } from "@angular/core";

//import { RenderObject } from "../render-objects/render-object";
import { ShaderProgram } from "../shaders/shader-program";
//import { diffuse_uniform_shader, diffuse_oren_nayar_shader, pbr_ggx_shader, per_vertex_color_shader, diffuse_texture_shader } from "../shaders/shader-program.module";
import { WEBGL2, GLTF } from "../webgl2/webgl2-token";
import { MainCamera } from "../game-engine/main-camera";
import { Vec3, Mat4, Transform } from "../game-engine/transform";
import { Mesh } from "../geometry/mesh";
import { MaterialLoader } from "../materials/material-loader";
import { BufferLoader } from "../webgl2/buffer-loader";
import { InputManager } from "../game-engine/input-manager";
//import { ObjectBuffer } from "../render-objects/object-buffer";

@Injectable()
export class SceneRenderer {

    //private scene_objects = new Map<OpaqueToken, RenderObject[]>();
    private light_direction = new Vec3(0.4, 0.4, 1.0);
    //private current_direction = new Vec3();

    private main_camera_: MainCamera;
    private meshes: Mesh[];

    constructor(
        @Inject(WEBGL2) private gl_context_: WebGL2RenderingContext,
        @Inject(GLTF) private gltf_data_: glTFData,
        private input_manager_: InputManager,
        //@Inject(diffuse_uniform_shader) private diffuse_uniform_shader_: ShaderProgram,
        //@Inject(diffuse_texture_shader) private diffuse_texture_shader_: ShaderProgram,
        //@Inject(diffuse_oren_nayar_shader) private diffuse_oren_nayar_shader_: ShaderProgram,
        @Inject(ShaderProgram) private pbr_ggx_shader_: ShaderProgram,
        private material_loader_: MaterialLoader,
        private buffer_loader_: BufferLoader
        //@Inject(per_vertex_color_shader) private per_vertex_shader_: ShaderProgram,
        //@Inject(static_objects) private static_objects: RenderObject[]
    ) { };

    constructScene() {
        this.gltf_data_.nodes.forEach(node => {
            // Construct Transform
            let node_transform: Transform;
            if (node.matrix) {
                node_transform = Transform.fromMatrix(node.matrix);
            }
            else {
                node_transform = new Transform(node.translation, node.rotation, node.scale);
            }

            if (node.camera) {
                this.main_camera_ = new MainCamera(this.input_manager_);
            }

            if (node.mesh) {
                let mesh = new Mesh(this.gl_context_, this.gltf_data_,
                    node.mesh, node_transform,
                    this.material_loader_, this.buffer_loader_
                );
                this.meshes.push(mesh);
            }
        });
        this.loadMeshes();
        this.start();
    };

    loadMeshes() {
        this.meshes.forEach(mesh => mesh.createMesh());
    };

    start() {
        this.main_camera_.initialiseCamera(this.gltf_data_.cameras[0].perspective);
        //this.diffuse_uniform_shader_.initProgram();
        //this.diffuse_texture_shader_.initProgram();
        //this.diffuse_oren_nayar_shader_.initProgram();
        this.pbr_ggx_shader_.initProgram();
        //this.per_vertex_shader_.initProgram();

        // Sort RenderObjects
        //this.static_objects.forEach(render_object => {
        //    let buffer_id = render_object.buffer_id;
        //    if (!this.scene_objects.get(buffer_id)) {
        //        this.scene_objects.set(buffer_id, [render_object]);
        //    }
        //    else {
        //        this.scene_objects.get(buffer_id).push(render_object);
        //    }
        //})
    };

    updateScene(dt: number) {
        this.main_camera_.updateCamera(dt);
        //let view = this.main_camera_.view.array;

        //this.current_direction.x = view[0] * this.light_direction.x + view[4] * this.light_direction.y + view[8] * this.light_direction.z;
        //this.current_direction.y = view[1] * this.light_direction.x + view[5] * this.light_direction.y + view[9] * this.light_direction.z;
        //this.current_direction.z = view[2] * this.light_direction.x + view[6] * this.light_direction.y + view[10] * this.light_direction.z;

        //this.meshes.forEach(mesh => {
        //    //object_array.forEach(object => {
        //        mesh.update(this.main_camera_.view, this.main_camera_.projection);
        //    //});
        //});
    };


    drawObjects() {
        //this.scene_objects.forEach((array: RenderObject[], type: OpaqueToken) => {
        //    if (array[0].id == "cube_low") {
        //        this.pbr_ggx_shader_.useProgram();
        //        this.gl.uniform3fv(this.pbr_ggx_shader_.getUniform("light_direction"), this.current_direction.array);
        //        array[0].beginDraw();
        //        array.forEach((object) => {
        //            object.drawObject(this.pbr_ggx_shader_);
        //        });
        //        array[0].finishDraw();
        //    }
        //    else {
        //        this.diffuse_uniform_shader_.useProgram();
        //        this.gl.uniform3fv(this.diffuse_uniform_shader_.getUniform("light_direction"), this.current_direction.array);
        //        array[0].beginDraw();
        //        array.forEach((object) => {
        //            object.drawObject(this.diffuse_uniform_shader_);
        //        });
        //        array[0].finishDraw();
        //    }
        //});
        this.pbr_ggx_shader_.useProgram();
        this.gl_context_.uniform3fv(this.pbr_ggx_shader_.getUniform("light_direction"), this.light_direction.array);
        this.meshes.forEach(mesh => mesh.drawMesh(this.pbr_ggx_shader_));
    };
}