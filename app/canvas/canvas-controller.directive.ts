import {
    Directive, HostListener, ElementRef, 
    HostBinding, DoCheck, OnDestroy, OnInit
} from "@angular/core";

import { distinctUntilChanged, debounceTime } from "rxjs/operators";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
//import { CanvasFrame } from "./canvas-frame.directive";
//import { MainCanvas } from "./main-canvas.component";
import { InputManager } from "../game-engine/input-manager";

//@Component({
//    selector: "canvas-controller",
//    template: `
//    <div #frame id="frame" tabindex="0" canvas-frame
//        [frameHeight]="frame.offsetHeight"
//        [frameWidth]="frame.offsetWidth"
//        [frameTop]="frame.offsetTop"
//        [frameLeft]="frame.offsetLeft"
//        (mousemove)="setMouseMovement($event)"
//        (mouseup) = "setMouseUp($event)"
//        (mousedown) = "setMouseDown($event)" 
//        (wheel)="onMouseWheel($event)" 
//        (mouseover)="setFocus($event)"
//        (keydown)="onKeyDown($event)" 
//        (keyup)="onKeyUp($event)" 
//        (contextmenu)="false"  
//    ><menu-button></menu-button>
//    <menu-display *ngIf="should_display_menu"></menu-display>
//    <skill-bar></skill-bar>
//    <skill-log></skill-log>
//    </div>
//    `,
//    styles: [`
//    #frame {
//        height: 100%;
//        width: 100%;
//        position: relative;
//        z-index: 5;
//        border: 0.25em dashed white;
//    }
//    `]
//})
@Directive({
    selector: "canvas-controller"
})
export class CanvasController implements OnInit, DoCheck, OnDestroy {
    //@ViewChild(CanvasFrame) canvas_frame: CanvasFrame;

    @HostBinding("width") canvas_width;
    @HostBinding("height") canvas_height;

    get client_width() {
        let width = (<HTMLCanvasElement>this.canvas_ref_.nativeElement).clientWidth;
        return width > 1920 ? 1920 : width;
    };

    get client_height() {
        let height = (<HTMLCanvasElement>this.canvas_ref_.nativeElement).clientHeight;
        return height > 1080 ? 1080 : height;
    };

    readonly resize_events = new Subject<{ width: number, height: number }>();
    private resize_sub_: Subscription;
    //should_display_menu = false;

    constructor(private input_manager_: InputManager, private canvas_ref_: ElementRef) { };

    ngOnInit() {
        this.resize_sub_ = this.resize_events.pipe(
            distinctUntilChanged((x, y) => x.width === y.width && x.height === y.height),
            debounceTime(50)
        )
        .subscribe((changes) => {
            this.input_manager_.aspect = changes.width / changes.height;
            this.canvas_width = changes.width;
            this.canvas_height = changes.height;
        });
    };

    ngDoCheck() {
        this.resize_events.next({ width: this.client_width, height: this.client_height });
    };

    @HostListener("mouseenter", ["$event"])
    setFocus(event: MouseEvent) {
        (<HTMLCanvasElement>event.target).focus();
    };

    @HostListener("mouseleave", ["$event"])
    lostFocus(event: MouseEvent) {
        // TODO want to reset all current key binds to false
    };

    @HostListener("contextmenu")
    hideContextMenu() {
        return false;
    };

    //updateCanvasDimensions(canvas: MainCanvas) {
    //    canvas.canvasHeight = this.canvas_frame.frameHeight;
    //    canvas.canvasWidth = this.canvas_frame.frameWidth;
    //    canvas.canvasTop = this.canvas_frame.frameTop;
    //    canvas.canvasLeft = this.canvas_frame.frameLeft;
    //};

    //isCanvasResizing() {
    //    if (this.canvas_frame.resizing) {
    //        this.canvas_frame.resizing = false;
    //        return true;
    //    }
    //    return false;
    //};

    @HostListener("wheel", ["$event"])
    onMouseWheel(event: WheelEvent) {
        let scroll: 1 | -1 = (event.deltaY > 0) ? 1 : -1;
        this.input_manager_.setWheelDirection(scroll);
        return false;
    };

    @HostListener("mouseup", ["$event"])
    setMouseUp(event: MouseEvent) {
        event.stopPropagation();
        if (event.button == 0) {
            this.input_manager_.setMouseButton("left", false);
        }
        else if (event.button == 2) {
            this.input_manager_.setMouseButton("right", false);
        } 
    };

    @HostListener("mousedown", ["$event"])
    setMouseDown(event: MouseEvent) {
        event.stopPropagation();
        if (event.button == 0) {
            this.input_manager_.setMouseButton("left", true);
        }
        else if (event.button == 2) {
            this.input_manager_.setMouseButton("right", true);
        }
    };

    @HostListener("keydown", ["$event"])
    onKeyDown(event: KeyboardEvent) {
        let code = event.code || event.key;
        this.input_manager_.setKeyDown(code);
        return false;
    };

    @HostListener("keyup", ["$event"])
    onKeyUp(event: KeyboardEvent) {
        let code = event.code || event.key;
        this.input_manager_.setKeyUp(code);
        return false;
    };

    @HostListener("mousemove", ["$event"])
    setMouseMovement(event: MouseEvent) {
        event.stopPropagation();
        let x = event.clientX / this.client_width;
        let y = 1 - (event.clientY / this.client_height);
        this.input_manager_.setMousePosition({ x, y });
        return false;
    };

    ngOnDestroy() {
        this.resize_sub_.unsubscribe();
    };
}