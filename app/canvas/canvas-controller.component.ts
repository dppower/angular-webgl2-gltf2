import {
    Component,
    ViewChild,
    ContentChild,
    AfterViewInit,
    AfterViewChecked,
    AfterContentChecked
}
from "@angular/core";

import { CanvasFrame } from "./canvas-frame.directive";
import { MainCanvas } from "./main-canvas.component";
import { InputManager, InputState } from "../game-engine/input-manager";

@Component({
    selector: "canvas-controller",
    template: `
    <div #frame id="frame" canvas-frame tabindex="0" 
        [frameHeight]="frame.offsetHeight" 
        [frameWidth]="frame.offsetWidth" 
        [frameTop]="frame.offsetTop" 
        [frameLeft]="frame.offsetLeft" 
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
    providers: [ InputManager ]
})
export class CanvasController implements AfterViewInit, AfterViewChecked, AfterContentChecked {
    @ViewChild(CanvasFrame) canvas_frame: CanvasFrame;
    @ContentChild(MainCanvas) main_canvas: MainCanvas;

    controllerWidth: number;
    controllerHeight: number;
    controllerTop: string;
    controllerLeft: string;

    constructor(private input_manager_: InputManager) { };

    setFocus(event: MouseEvent) {
        (<HTMLElement>event.target).focus();
    };

    ngAfterViewInit() {
    };

    ngAfterContentChecked() {
        this.main_canvas.canvasHeight = this.controllerHeight;
        this.main_canvas.canvasWidth = this.controllerWidth;
        this.main_canvas.canvasTop = this.controllerTop;
        this.main_canvas.canvasLeft = this.controllerLeft;
    };

    ngAfterViewChecked() {
        setTimeout(() => {
            this.controllerHeight = this.canvas_frame.frameHeight;
            this.controllerWidth = this.canvas_frame.frameWidth;
            this.controllerTop = this.canvas_frame.frameTop;
            this.controllerLeft = this.canvas_frame.frameLeft;
        }, 0);
    };

    onMouseWheel(event: WheelEvent) {
        this.input_manager_.zoom = event.deltaY;
        return false;
    };

    onMouseClick(event: MouseEvent) {
        //this.setFocus(event);
        if (event.button == 0) {
            this.input_manager_.setMouseCoords(event.clientX, event.clientY);
        } 
    };

    onKeyDown(event: KeyboardEvent) {
        this.input_manager_.setKeyDown(event);
        return false;
    };

    onKeyUp(event: KeyboardEvent) {
        this.input_manager_.setKeyUp(event);
        return false;
    };

    onMouseMove(event: MouseEvent) {
        if (event.buttons == 2) {
            this.input_manager_.setCenteredCoords(event.clientX, event.clientY, this.canvas_frame.frameWidth, this.canvas_frame.frameHeight);
        }     
        return false;
    };
}