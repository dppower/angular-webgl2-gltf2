import {Component, ViewChild, AfterViewInit} from "angular2/core";

@Component({
    selector: 'my-app',
    template: `
        <canvas #canvas [width]="canvasWidth" [height]="canvasHeight"></canvas>
    `
})
export class AppComponent implements AfterViewInit {
    @ViewChild("canvas") canvasElement: any;
    canvasWidth: number = 600;
    canvasHeight: number = 600;

    ngAfterViewInit() {
        var canvas: HTMLCanvasElement = this.canvasElement.nativeElement;
        var context = canvas.getContext("2d");

        var img = new Image();
        img.src = "./images/skeleton.png";
        img.onload = function () {
            context.drawImage(img, 0, 0);
        }
    }

}