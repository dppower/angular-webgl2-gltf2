import { Injectable, Injector, StaticProvider, Type, InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { tap } from "rxjs/operators";
import { WEBGL2, GLTF } from "./webgl2-token";
//import { Transform } from "../game-engine/transform";
//import { MainCamera } from "../game-engine/main-camera";
//import { Mesh } from "../geometry/mesh";
import { MaterialLoader } from "../materials/material-loader";
import { BufferLoader } from "../webgl2/buffer-loader";
import { SceneRenderer } from "../renderers/scene-renderer";
import { shader_providers } from "../shaders/shader-program.module";

/**
 * Constructs mesh/camera/skin for each node, used by Scene Renderer.
 */
@Injectable()
export class SceneLoader {

    getItem<T>(type: Type<T> | InjectionToken<T>) {
        return this.injector_.get(type);
    };
    //meshes: Mesh[];
    //main_camera: MainCamera;

    private gltf_data_: glTFData;
    private webgl_context_: WebGL2RenderingContext;
    private injector_: Injector;

    constructor(private http_client_: HttpClient) { };

    //fetchGLTFData()
    createWebGLResources(context: WebGL2RenderingContext) {
        this.webgl_context_ = context;
        let providers: StaticProvider[] = [
            //{ provide: SceneLoader, useValue: this },
            { provide: WEBGL2, useValue: this.webgl_context_ },
            { provide: GLTF, useValue: this.gltf_data_ },
            { provide: MaterialLoader, useClass: MaterialLoader, deps:[HttpClient, GLTF] },
            { provide: BufferLoader, useClass: BufferLoader, deps: [HttpClient, WEBGL2, GLTF] },
            { provide: SceneRenderer, useClass: SceneRenderer, deps: [] },
            ...shader_providers
        ];

        this.injector_ = Injector.create(providers);

        //this.resource_loader_ = this.context_injector.get(ResourceLoader);

        //this.resource_loader_.loadResources().subscribe((object) => { }, error => { }, () => {
        //    this.scene_renderer = this.resource_loader_.getResource(SceneRenderer);
        //    this.scene_renderer.start();
        //});
    };

    /**
     * Fetch a .gltf or .glb file from server
     */
    fetchGLTFData(uri: string, context: WebGL2RenderingContext) {
        return this.http_client_.get<glTFData>(uri)
            .pipe(
                tap(data => {
                    this.gltf_data_ = data;
                    this.createWebGLResources(context);
                })
            );
    };

    
}