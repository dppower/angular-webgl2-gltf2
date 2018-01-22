import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

import { InputManager } from "./input-manager";

@Injectable()
export class RenderLoop {

    get fps() {
        return this.frames_per_second;
    };

    private cancel_token: number;
    private previous_time: number;
    private accumulated_time: number;
    private time_step = 1000 / 60; // milliseconds
    private dt = 1 / 60; // seconds
    private total_time: number; // Time in milliseconds since beginning of level
    // fps
    private frames_per_second = 60;
    private last_fps_update: number;
    private frames_this_second = 0;

    readonly render_events = new Subject<number>();
    readonly update_events = new Subject<number>();

    readonly total_time_updates = new Subject<number>();   
    readonly rAF_begin = new Subject<number>();

    private pause_updates_ = false;

    constructor(private input_manager: InputManager) { };

    begin() {
        this.previous_time = performance.now();
        this.accumulated_time = 0;
        this.total_time = 0;
        this.cancel_token = requestAnimationFrame((time: number) => {
            this.last_fps_update = performance.now();
            this.update(time);
        });
    };

    update(time_now: number) {
        this.cancel_token = requestAnimationFrame((time: number) => {
            this.update(time);
        });

        this.rAF_begin.next(time_now);

        if (time_now > this.last_fps_update + 1000) { // update every second
            this.frames_per_second = 0.25 * this.frames_this_second + 0.75 * this.frames_per_second;
            // Reset
            this.last_fps_update = time_now;
            this.frames_this_second = 0;
        }
        this.frames_this_second++;

        if (!this.pause_updates_) {
            let delta_time = time_now - this.previous_time;
            this.accumulated_time += delta_time;
            while (this.accumulated_time > this.time_step) {
                // Update
                this.update_events.next(this.dt);
                this.accumulated_time -= this.time_step;
            }

            this.previous_time = time_now;

            this.input_manager.update();

            this.total_time += delta_time;
            this.total_time_updates.next(this.total_time);
        }

        let alpha = this.pause_updates_ ? 1 : this.accumulated_time / this.time_step;
        this.render_events.next(alpha);
    };

    pauseUpdates() {
        this.pause_updates_ = true;
    };

    stop() {
        this.cancel_token && cancelAnimationFrame(this.cancel_token);
        this.pause_updates_ = false;
    };
};