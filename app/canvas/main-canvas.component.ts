import { Component, ViewChild, ElementRef, AfterViewInit, forwardRef, OnDestroy, NgZone, ReflectiveInjector } from "@angular/core";

import { Webgl2Context } from "./webgl2-context.directive";
import { MainCamera } from "../game-engine/main-camera";
import { InputManager } from "../game-engine/input-manager";

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
    `,
    styles: [`
    #canvas {
        position: absolute;
        z-index: 0;
    }
    `],
    providers: [MainCamera]
})
export class MainCanvas implements OnDestroy {
    @ViewChild(Webgl2Context) webgl_context: Webgl2Context;

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
    ) { };
    
    getCanvasWidth() {
        let width = this.canvasWidth > 1920 ? 1920 : this.canvasWidth;
        return width;
    };

    getCanvasHeight() {
        let height = this.canvasHeight > 1080 ? 1080 : this.canvasHeight;
        return height;
    };

    ngAfterViewInit() {

        if (this.webgl_context.createContext()) {
            this.ng_zone.runOutsideAngular(() => {
                this.cancel_token = requestAnimationFrame(() => {
                    this.update();
                });
            });
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

        this.input_manager.update();

        this.main_camera.updateCamera(this);

        // Update objects in scene
        let time_now = window.performance.now();
        this.accumulated_time += (time_now - this.previous_time); 
        while (this.accumulated_time > this.time_step) {
            this.webgl_context.update(this.time_step, this.main_camera, this.canvasWidth, this.canvasHeight);
            this.accumulated_time -= this.time_step;
        }

        this.previous_time = time_now;

        // Draw scene
        this.webgl_context.draw(this.main_camera);
    };

    ngOnDestroy() {
        cancelAnimationFrame(this.cancel_token);
    }
}