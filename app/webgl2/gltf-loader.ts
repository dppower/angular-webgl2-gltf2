//import { Injectable, OpaqueToken, Inject, Injector, ReflectiveInjector, Provider, FactoryProvider, ValueProvider } from "@angular/core";
//import { Http, Response } from "@angular/http";

//import { Observable, Subject } from "rxjs/Rx";

//import { webgl2, static_objects } from "./webgl2-token";
//import { RenderObject } from "../render-objects/render-object";
//import { ObjectBuffer } from "../render-objects/object-buffer";
//import { VertexData } from "../render-objects/vertex-data";
//import { RenderObjectData } from "../render-objects/render-object-data";
//import { shader_providers } from "../shaders/shader-program.module";
//import { TextureLoader } from "../textures/texture-loader";
//import { SceneRenderer } from "../renderers/scene-renderer";
//import { ImageDecoder } from "../textures/image-decoder";

//declare type RenderObjectList = { [id: string]: RenderObjectData }

//@Injectable()
//export class ResourceLoader {

//    private resources_loaded$ = new Subject<boolean>();
//    private providers_$: Observable<Provider>;
//    private providers: Provider[] = [];
    
//    private static_buffer_names = new Map<string, OpaqueToken>();

//    private resource_injector_: ReflectiveInjector;

//    constructor(private http_: Http, @Inject(webgl2) private gl: WebGL2RenderingContext, private injector_: Injector) { };

//    loadResources() {
        
//        // TODO: Rework the shader program to fetch from server.
//        this.providers.push(shader_providers);
//        this.providers.push(TextureLoader);
//        this.providers.push(ImageDecoder);
//        this.providers.push(SceneRenderer);
       
//        this.providers_$ = this.getStaticObjects()
//            //.concat(this.getVertexBufferData(this.static_buffer_names));

//        this.providers_$.subscribe(
//            provider => {
//                this.providers.push(provider);
//                },
//                err => { },
//                () => {
//                    this.getVertexBufferData(this.static_buffer_names)
//                    .subscribe(
//                        provider => { this.providers.push(provider); },
//                        error => { },
//                        () => {
//                            this.resource_injector_ = ReflectiveInjector.resolveAndCreate(this.providers, this.injector_);
//                            this.resources_loaded$.complete();
//                        }
//                    );
//                }
//            );

//        return this.resources_loaded$.asObservable();
//    };

//    getResource(token: any) {
//        return this.resource_injector_.get(token);
//    };

//    getStaticObjects() {
//        let url = "/static-scene-objects";

//        return this.http_.get(url).mergeMap((res: Response) => {
//            let object_list: RenderObjectList = res.json();
//            return Observable.pairs(object_list);
//        }).map<FactoryProvider>((pair_array: [string, RenderObjectData]) => {
//            let [id, render_data] = pair_array;
//            let buffer_token = this.setUniqueBufferNames(render_data.mesh_id);
//            return { provide: static_objects, useFactory: this.createRenderObject(render_data, buffer_token), deps: [Injector, TextureLoader, webgl2, buffer_token], multi: true };
//        })
//    };

//    setUniqueBufferNames(name: string) {
//        if (!this.static_buffer_names.get(name)) {
//            this.static_buffer_names.set(name, new OpaqueToken(name));
//        }
//        return this.static_buffer_names.get(name);
//    };

//    getVertexBufferData(buffer_names: Map<string, OpaqueToken>) {
//        return Observable.from(Array.from(buffer_names.keys())).flatMap(id => {
//            let url = "/vertex-data/" + id;
//            return this.http_.get(url).map(res => res.json());
//        }).map<ValueProvider>((vertex_data: VertexData) => {
//            let token = buffer_names.get(vertex_data.name);
//            let buffer = new ObjectBuffer(this.gl, token);
//            buffer.initVertexArray(vertex_data);
//            let provider = { provide: buffer.id, useValue: buffer };
//            return provider;
//        });
//    };

//    createRenderObject(data: RenderObjectData, buffer_token: OpaqueToken) {
//        return (injector: Injector, loader: TextureLoader) => {
//            let gl = <WebGL2RenderingContext>(injector.get(webgl2));
//            let buffer = <ObjectBuffer>(injector.get(buffer_token));
//            return new RenderObject(gl, loader, data, buffer);
//        };
//    };
//};