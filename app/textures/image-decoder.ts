import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ImageDecoder {   

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D; 

    constructor() {
        this.canvas = document.createElement("canvas");
        this.context = (<CanvasRenderingContext2D>this.canvas.getContext("2d"));
    };

    decode(data: Blob) {
        return new Observable<ImageData>((observer) => {

            let img = new Image();

            img.onload = ((event: Event) => {
                this.canvas.height = img.height;
                this.canvas.width = img.width;

                this.context.drawImage(img, 0, 0);

                let image_data = this.context.getImageData(0, 0, img.width, img.height);
                window.URL.revokeObjectURL(img.src);

                observer.next(image_data);
                observer.complete();
            });
            
            img.src = window.URL.createObjectURL(data);
        });
    };
};