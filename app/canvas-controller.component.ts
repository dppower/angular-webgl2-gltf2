import {Component, ViewChild, ContentChild, AfterViewInit, AfterViewChecked, AfterContentChecked} from "@angular/core";
import {CanvasDimensions} from "./canvas-dimensions.directive";
import {MainCanvas} from "./main-canvas.component";
import {InputManager, InputState} from "./input-manager";

@Component({
    selector: "canvas-controller",
    template: `
    <div #frame id="frame" canvas-dimensions tabindex="0" 
        [inHeight]="frame.offsetHeight" 
        [inWidth]="frame.offsetWidth" 
        [inTop]="frame.offsetTop" 
        [inLeft]="frame.offsetLeft" 
        (mousemove)="onMouseMove($event)" 
        (wheel)="onMouseWheel($event)"
        (click)="onMouseClick($event)" 
        (mouseenter)="setFocus($event)"
        (keydown)="onKeyDown($event)" 
        (keyup)="onKeyUp($event)" 
        (contextmenu)="false"  
    ></div>
    <ng-content></ng-content>
    `,
    styles: [`
    #frame {
        height: 100%;
        width: 100%;
        position: relative;
        z-index: 10;
        border: 0.25em dashed white;
    }
    `],
    directives: [CanvasDimensions],
    providers: [InputManager]
})
export class CanvasController implements AfterViewInit, AfterViewChecked, AfterContentChecked {
    @ViewChild(CanvasDimensions) dimensions: CanvasDimensions;
    @ContentChild(MainCanvas) canvas: MainCanvas;

    constructor(private inputManager_: InputManager) { };

    outCanvasWidth: number;
    outCanvasHeight: number;
    outCanvasTop: string;
    outCanvasLeft: string;

    setFocus(event: MouseEvent) {
        (<HTMLElement>event.target).focus();
    };

    ngAfterViewInit() {
    };

    ngAfterContentChecked() {
        this.canvas.canvasHeight = this.outCanvasHeight;
        this.canvas.canvasWidth = this.outCanvasWidth;
        this.canvas.canvasTop = this.outCanvasTop;
        this.canvas.canvasLeft = this.outCanvasLeft;
    };

    ngAfterViewChecked() {
        setTimeout(() => {
            this.outCanvasHeight = this.dimensions.inHeight;
            this.outCanvasWidth = this.dimensions.inWidth;
            this.outCanvasTop = this.dimensions.inTop;
            this.outCanvasLeft = this.dimensions.inLeft;
        }, 0);
    };

    onMouseWheel(event: WheelEvent) {
        this.inputManager_.zoom = event.deltaY;
        return false;
    };

    onMouseClick(event: MouseEvent) {
        this.setFocus(event);
        if (event.button == 0) {
            console.log("left-click");
            this.inputManager_.setMouseCoords(event.clientX, event.clientY);
        } 
    };

    onKeyDown(event: KeyboardEvent) {
        this.inputManager_.setKeyDown(event);
        return false;
    };

    onKeyUp(event: KeyboardEvent) {
        this.inputManager_.setKeyUp(event);
        return false;
    };

    onMouseMove(event: MouseEvent) {
        if (event.buttons == 2) {
            this.inputManager_.setCenteredCoords(event.clientX, event.clientY, this.dimensions.inWidth, this.dimensions.inHeight);
        }     
        return false;
    };
}