import {Component, ViewChild, AfterViewInit} from "angular2/core";

@Component({
    selector: 'my-app',
    template: `
        <div #frame class="frame">
            <canvas #canvas [width]="canvasWidth" [height]="canvasHeight"></canvas>
        </div>
    `,
    styles: [`
        .frame {
            height: 20%;
            width: 20%;
        }
    `]
})
export class AppComponent implements AfterViewInit {
    @ViewChild("canvas") canvasRef: any;
    @ViewChild("frame") frameRef: any;
    canvas: HTMLCanvasElement;
    frame: HTMLDivElement;
    canvasWidth: number;
    canvasHeight: number;

    ngAfterViewInit() {
        this.canvas = this.canvasRef.nativeElement;
        this.frame = this.frameRef.nativeElement;
        var context = this.canvas.getContext("2d");

        this.canvasWidth = this.frame.clientWidth;
        this.canvasHeight = this.frame.clientHeight;
        // Handle resizing the canvas
        window.onresize = () => {
            this.resizeCanvas();
            context.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
        }

        var img = new Image();
        img.src = "./images/skeleton.png";
        img.onload = () => {
            context.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
        }
    }

    resizeCanvas() {
        this.canvasWidth = this.frame.clientWidth;
        this.canvasHeight = this.frame.clientHeight;
    }

}