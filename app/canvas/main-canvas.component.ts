import { Component, AfterViewInit, ViewChild } from "@angular/core";

import { Webgl2Directive } from "../webgl2/webgl2.directive";
//import { MainCamera } from "../game-engine/main-camera";
//import { InputManager } from "../game-engine/input-manager";
//import { CanvasController } from "./canvas-controller.directive";

@Component({
    selector: 'main-canvas',
    template: `
    <canvas webgl2 canvas-controller><p>{{fallback_text}}</p></canvas>
    `,
    styles: [`
    canvas {
        height: 100%;
        width: 100%;
        border: none;
        position: absolute;
        z-index: 0;
    }
    `]
})
export class MainCanvas /*implements OnDestroy*/ {

    @ViewChild(Webgl2Directive) webgl_context: Webgl2Directive;
    //@ViewChild(CanvasController) canvas_controller: CanvasController;

    fallback_text = "Loading Canvas...";

    //canvasWidth: number;
    //canvasHeight: number;
    //canvasTop: string;
    //canvasLeft: string;

    //get aspect() {
    //    let current_aspect = this.canvasWidth / this.canvasHeight
    //    return current_aspect || 1.5;
    //}

    //private cancel_token: number;
    //private previous_time = 0;
    //private time_step = 1000 / 60.0;
    //private accumulated_time = 0;

    constructor(
        //private main_camera: MainCamera,
        //private input_manager: InputManager
    ) {
        //this.canvasWidth = 640;
        //this.canvasHeight = 480;
        //this.canvasTop = "0";
        //this.canvasLeft = "0";
    };
    
    //getCanvasWidth() {
    //    let width = this.canvasWidth > 1920 ? 1920 : this.canvasWidth;
    //    return width;
    //};

    //getCanvasHeight() {
    //    let height = this.canvasHeight > 1080 ? 1080 : this.canvasHeight;
    //    return height;
    //};

    ngAfterViewInit() {
        //this.main_camera.initialiseCamera();

        //if (this.webgl_context.createContext()) {
        //    this.cancel_token = requestAnimationFrame(() => {
        //        this.update();
        //    });
        //}
        //else {
        if (!this.webgl_context.createContext()) {
            console.log("Unable to initialise Webgl.");
            setTimeout(() => {
                this.fallback_text = "Unable to initialise Webgl."
            }, 0);
        }
    }

    //update() {
    //    this.cancel_token = requestAnimationFrame(() => {
    //        this.update();
    //    });
    //    //this.canvas_controller.updateCanvasDimensions(this);

    //    //this.input_manager.update();

    //    // Update objects in scene
    //    let time_now = window.performance.now();
    //    let delta_time = time_now - this.previous_time; 
    //    this.accumulated_time += delta_time; 
    //    while (this.accumulated_time > this.time_step) {
    //        this.webgl_context.update(this.time_step, this.main_camera, this.canvasWidth, this.canvasHeight);
            
    //        this.accumulated_time -= this.time_step;
    //    }
    //    this.main_camera.updateCamera(delta_time, this);

    //    // Draw scene

    //    if (!this.canvas_controller.isCanvasResizing()) {
    //        this.webgl_context.draw(this.main_camera);
    //    }

    //    this.previous_time = time_now;
    //};

    //ngOnDestroy() {
    //    //cancelAnimationFrame(this.cancel_token);
    //}
}