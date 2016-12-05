import { Injectable } from "@angular/core";
import { Http, Response, ResponseContentType, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";

import { Texture2d } from "./texture-2d";
import { ImageDecoder } from "./image-decoder";

@Injectable()
export class TextureLoader {
    private cache_: { [texture_name: string]: ImageData } = {};

    constructor(private http_: Http, private decoder_: ImageDecoder) { };

    loadTexture(texture_name: string): Observable<ImageData> {
        let texture = this.cache_[texture_name];
        if (texture) {
            return Observable.of(texture);
        }

        let url = "/textures/" + texture_name + ".jpg";

        return this.http_.get(url, { responseType: ResponseContentType.Blob })
            .mergeMap(response => {
                let data = response.blob();
                return this.decoder_.decode(data);
            }).do((image: ImageData) => {
                this.cache_[texture_name] = image;
            }).catch(this.handleError);
    };

    handleError(err: Response) {
        console.log(err);
        return Observable.throw(err.json() || "Server error!");
    };

    clearCache() {
        
    };
};