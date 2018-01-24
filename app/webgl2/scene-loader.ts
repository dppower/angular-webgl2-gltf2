import { Injectable, Injector, StaticProvider, Type, InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { tap } from "rxjs/operators";
import { WEBGL2, GLTF } from "./webgl2-token";
import { PBR_SHADER } from "../shaders/shader-program.module";
import { InputManager } from "../game-engine/input-manager";
import { MaterialLoader } from "../materials/material-loader";
import { BufferLoader } from "../webgl2/buffer-loader";
import { SceneRenderer } from "../renderers/scene-renderer";
import { shader_providers } from "../shaders/shader-program.module";

@Injectable()
export class GLTFLoader {

    getItem<T>(type: Type<T> | InjectionToken<T>) {
        return this.injector_.get(type);
    };

    private gltf_data_: glTFData;
    private webgl_context_: WebGL2RenderingContext;
    private injector_: Injector;

    constructor(private http_client_: HttpClient, private parent_injector_: Injector) { };

    //fetchGLTFData()
    createWebGLResources(context: WebGL2RenderingContext) {
        this.webgl_context_ = context;
        let providers: StaticProvider[] = [
            { provide: WEBGL2, useValue: this.webgl_context_ },
            { provide: GLTF, useValue: this.gltf_data_ },
            { provide: MaterialLoader, useClass: MaterialLoader, deps: [HttpClient, WEBGL2, GLTF] },
            { provide: BufferLoader, useClass: BufferLoader, deps: [HttpClient, GLTF] },
            {
                provide: SceneRenderer,
                useClass: SceneRenderer,
                deps: [WEBGL2, GLTF, InputManager, PBR_SHADER, MaterialLoader, BufferLoader]
            },
            ...shader_providers
        ];

        this.injector_ = Injector.create(providers, this.parent_injector_);
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