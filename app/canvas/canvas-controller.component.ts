import {
    Component,
    ViewChild,
    ContentChild,
    AfterViewInit,
    AfterViewChecked,
    AfterContentChecked,
}
from "@angular/core";

import { CanvasFrame } from "./canvas-frame.directive";
import { MainCanvas } from "./main-canvas.component";
import { InputManager } from "../game-engine/input-manager";
import { Vec2 } from "../game-engine/vec2";


@Component({
    selector: "canvas-controller",
    template: `
    <div #frame id="frame" canvas-frame tabindex="0" 
        [frameHeight]="frame.offsetHeight" 
        [frameWidth]="frame.offsetWidth" 
        [frameTop]="frame.offsetTop" 
        [frameLeft]="frame.offsetLeft"
        (mousemove)="setMouseMovement($event)"
        (mouseup) = "setMouseUp($event)"
        (mousedown) = "setMouseDown($event)" 
        (wheel)="onMouseWheel($event)" 
        (mouseover)="setFocus($event)"
        (keydown)="onKeyDown($event)" 
        (keyup)="onKeyUp($event)" 
        (contextmenu)="false"  
    ><menu-button></menu-button>
    <menu-display *ngIf="should_display_menu"></menu-display>
    <skill-bar></skill-bar>
    <skill-log></skill-log>
    </div>
    <ng-content></ng-content>
    `,
    styles: [`
    #frame {
        height: 100%;
        width: 100%;
        position: relative;
        z-index: 5;
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

    should_display_menu = false;

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
        this.input_manager_.setWheelDirection(event.deltaY);
        return false;
    };

    setMouseUp(event: MouseEvent) {
        event.stopPropagation();
        if (event.button == 0) {
            this.input_manager_.setMouseButton("left", false);
        }
        else if (event.button == 2) {
            this.input_manager_.setMouseButton("right", false);
        } 
    };

    setMouseDown(event: MouseEvent) {
        event.stopPropagation();
        if (event.button == 0) {
            this.input_manager_.setMouseButton("left", true);
        }
        else if (event.button == 2) {
            this.input_manager_.setMouseButton("right", true);
        }
    };

    onKeyDown(event: KeyboardEvent) {
        this.input_manager_.setKeyDown(event.code);

        return false;
    };

    onKeyUp(event: KeyboardEvent) {
        this.input_manager_.setKeyUp(event.code);

        return false;
    };

    setMouseMovement(event: MouseEvent) {
        event.stopPropagation();

        this.input_manager_.setPointerCoords(new Vec2(event.clientX, event.clientY));
            
        return false;
    };
}