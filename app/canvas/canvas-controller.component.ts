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
    <div #frame id="frame" tabindex="0" canvas-frame
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
    `,
    styles: [`
    #frame {
        height: 100%;
        width: 100%;
        position: relative;
        z-index: 5;
        border: 0.25em dashed white;
    }
    `]
})
export class CanvasController {
    @ViewChild(CanvasFrame) canvas_frame: CanvasFrame;

    should_display_menu = false;

    constructor(private input_manager_: InputManager) { };

    setFocus(event: MouseEvent) {
        (<HTMLElement>event.target).focus();
    };

    updateCanvasDimensions(canvas: MainCanvas) {
        canvas.canvasHeight = this.canvas_frame.frameHeight;
        canvas.canvasWidth = this.canvas_frame.frameWidth;
        canvas.canvasTop = this.canvas_frame.frameTop;
        canvas.canvasLeft = this.canvas_frame.frameLeft;
    };

    isCanvasResizing() {
        if (this.canvas_frame.resizing) {
            this.canvas_frame.resizing = false;
            return true;
        }
        return false;
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

        this.input_manager_.setPointerMovement(new Vec2(event.clientX, event.clientY));
            
        return false;
    };
}