import { Injectable } from "@angular/core";
import { Transform } from "../game-engine/transform";
import { MainCamera } from "../game-engine/main-camera";
import { Mesh } from "../geometry/mesh";
import { MaterialLoader } from "../materials/material-loader";
import { BufferLoader } from "../webgl2/buffer-loader";

/**
 * Constructs mesh/camera/skin for each node, used by Scene Renderer.
 */
@Injectable()
export class SceneLoader {

    meshes: Mesh[];
    main_camera: MainCamera;

    constructor(private gl_context_: WebGL2RenderingContext, private gltf_data_: glTF,
        private material_loader_: MaterialLoader, private buffer_loader_: BufferLoader
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
                //this.main_camera = new MainCamera();
            }

            if (node.mesh) {
                let mesh = new Mesh(this.gl_context_, this.gltf_data_,
                    node.mesh, node_transform,
                    this.material_loader_, this.buffer_loader_
                );
                this.meshes.push(mesh);
            }
        });
    };

    loadMeshes() {
        this.meshes.forEach(mesh => mesh.createMesh());
    };
}