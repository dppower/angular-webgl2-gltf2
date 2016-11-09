import { Injectable, OpaqueToken } from "@angular/core";
import { Http, Response } from "@angular/http";

import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/toPromise";

import { RenderObject, RenderObjectData } from "../renderers/render-object"
import { Vec3, Quaternion } from "../game-engine/transform";
import { Color } from "../game-engine/color";
import { ObjectBuffer } from "../vertex-data/object-buffer";
import { VertexData } from "../vertex-data/vertex-data"

interface RawRenderObjectData {
    name: string;
    position: number[];
    rotation: number[];
    mesh_id: string;
    uniform_color?: number[];
};

declare type RenderObjectDataList = { [id: string]: RawRenderObjectData }

@Injectable()
export class ResourceLoader {

    scene_objects = new Map<OpaqueToken, RenderObject[]>();
    private buffer_names = new Map<string, OpaqueToken>();
    private render_object_data_ = new Map<string, RenderObjectData>();
    object_buffer_data_ = new Map<OpaqueToken, ObjectBuffer>();

    private object_response_: Observable<RenderObjectDataList>;
    private object_buffer_data_$: Observable<ObjectBuffer>

    constructor(private http_: Http) { };

    getStaticObjectsList() {
        let url = "/static-scene-objects";

        return this.http_.get(url).map((res: Response) => {
            let object_list: RenderObjectDataList = res.json();
            return object_list;
        }).do(object_list => {
            for (let i in object_list) {
                let object = object_list[i];
                let refined_object_data: RenderObjectData = Object.assign({}, object, {
                    position: Vec3.fromArray(object.position),
                    rotation: Quaternion.fromArray(object.rotation),
                    uniform_color: Color.fromArray(object.uniform_color || [1.0, 1.0, 1.0, 1.0])
                });
                this.render_object_data_.set(i, refined_object_data);
            }
        });
    };

    setUniqueBufferData() {
        let unique_vertex_data: string[] = [];
        this.render_object_data_.forEach((object: RenderObjectData) => {
            unique_vertex_data.push(object.mesh_id);
        });
        unique_vertex_data = Array.from(new Set(unique_vertex_data));

        unique_vertex_data.forEach(buffer_name => {
            this.buffer_names.set(buffer_name, new OpaqueToken(buffer_name));
        });
        return unique_vertex_data;
    }

    getVertexData(gl: WebGL2RenderingContext) {
        
        let keys = this.setUniqueBufferData();

        return Observable.from(keys).flatMap(data_id => {
            let url = "/vertex-data/" + data_id;
            return this.http_.get(url).map(res => {
                return res.json();
            });
        }).map((vertex_data: VertexData) => {
            let buffer = new ObjectBuffer(gl);
            buffer.initVertexArray(vertex_data);
            let token = this.buffer_names.get(buffer.name);
            let provider = { provide: token, useValue: buffer };
            return provider;
        }).do(provider => {
            this.object_buffer_data_.set(provider.provide, provider.useValue);
            this.createRenderObjects();
        });
    };

    createRenderObjects() {
        this.render_object_data_.forEach((data) => {
            let id = data.mesh_id;
            let token = this.buffer_names.get(id);
            //let buffer = this.object_buffer_data_.get(id);
            let render_object = new RenderObject(data);
            if (this.scene_objects.get(token)) {
                this.scene_objects.get(token).push(render_object);
            }
            else {
                this.scene_objects.set(token, [render_object]);
            }
            
        })
    };
};