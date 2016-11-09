import { Component, ViewChild, ElementRef, AfterViewInit, forwardRef, OnDestroy, NgZone, ReflectiveInjector } from "@angular/core";

import { Webgl2Context } from "./webgl2-context.directive";
import { MainCamera } from "../game-engine/main-camera";
import { InputManager } from "../game-engine/input-manager";
import { CanvasController } from "./canvas-controller.component";

@Component({
    selector: 'main-canvas',
    template: `
    <canvas canvas-context id="canvas" 
        [width]="getCanvasWidth()" 
        [height]="getCanvasHeight()" 
        [style.width]="canvasWidth" 
        [style.height]="canvasHeight" 
        [style.top]="canvasTop" 
        [style.left]="canvasLeft"
    ><p>{{fallbackText}}</p></canvas>
    <canvas-controller></canvas-controller>
    `,
    styles: [`
    #canvas {
        position: absolute;
        z-index: 0;
    }
    `],
    providers: [MainCamera, InputManager]
})
export class MainCanvas implements OnDestroy {
    @ViewChild(Webgl2Context) webgl_context: Webgl2Context;
    @ViewChild(CanvasController) canvas_controller: CanvasController;

    fallbackText = "Loading Canvas...";

    canvasWidth: number;
    canvasHeight: number;
    canvasTop: string;
    canvasLeft: string;

    get aspect() {
        let current_aspect = this.canvasWidth / this.canvasHeight
        return current_aspect || 1.78;
    }

    private cancel_token: number;
    private previous_time = 0;
    private time_step = 1000 / 60.0;
    private accumulated_time = 0;

    constructor(
        private ng_zone: NgZone,
        private main_camera: MainCamera,
        private input_manager: InputManager
    ) {
        this.canvasWidth = 640;
        this.canvasHeight = 480;
        this.canvasTop = "0";
        this.canvasLeft = "0";
    };
    
    getCanvasWidth() {
        let width = this.canvasWidth > 1920 ? 1920 : this.canvasWidth;
        return width;
    };

    getCanvasHeight() {
        let height = this.canvasHeight > 1080 ? 1080 : this.canvasHeight;
        return height;
    };

    ngAfterViewInit() {
        this.main_camera.initialiseCamera();

        if (this.webgl_context.createContext()) {
            //this.ng_zone.runOutsideAngular(() => {
                this.cancel_token = requestAnimationFrame(() => {
                    this.update();
                });
            //});
        }
        else {
            console.log("Unable to initialise Webgl.");
            setTimeout(() => {
                this.fallbackText = "Unable to initialise Webgl."
            }, 0);
        }
    }

    update() {
        //this.ng_zone.runOutsideAngular(() => {
            this.cancel_token = requestAnimationFrame(() => {
                this.update();
            });
        //});
        this.canvas_controller.updateCanvasDimensions(this);

        this.input_manager.update();

        // Update objects in scene
        let time_now = window.performance.now();
        let delta_time = time_now - this.previous_time; 
        this.accumulated_time += delta_time; 
        while (this.accumulated_time > this.time_step) {
            this.webgl_context.update(this.time_step, this.main_camera, this.canvasWidth, this.canvasHeight);
            
            this.accumulated_time -= this.time_step;
        }
        this.main_camera.updateCamera(delta_time, this);

        // Draw scene

        if (!this.canvas_controller.isCanvasResizing()) {
            this.webgl_context.draw(this.main_camera);
        }

        this.previous_time = time_now;
    };

    ngOnDestroy() {
        cancelAnimationFrame(this.cancel_token);
    }
}