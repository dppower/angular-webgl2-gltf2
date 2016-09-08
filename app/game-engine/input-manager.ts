import { Injectable } from "@angular/core";

const key_bindings = new Map<string, number>();
key_bindings.set("forward", 69);
key_bindings.set("back", 68);
key_bindings.set("left", 83);
key_bindings.set("right", 70);
key_bindings.set("jump", 32);

const move_set = ["forward", "back", "left", "right"];
const action_set = ["jump"];

export class InputState {
    aspect = 1.78;
    zoom = 0.0;
    mouseX = 0.0;
    mouseY = 0.0;
    mouseDx = 0.0;
    mouseDy = 0.0;
    keyDown: string[] = [];
    keyPressed: string[] = [];
};

@Injectable()
export class InputManager {

    private zoom_ = 0.0;

    previousMouseX = 0.0;
    previousMouseY = 0.0;

    centeredMouseX = 0.0;
    centeredMouseY = 0.0;

    currentMouseX = 0.0;
    currentMouseY = 0.0;

    setMouseCoords(x: number, y: number) {
        this.currentMouseX = x;
        this.currentMouseY = y;
    };

    setCenteredCoords(x: number, y: number, canvasWidth: number, canvasHeight: number) {
        this.centeredMouseX = 2 * (x / canvasWidth) - 1;
        this.centeredMouseY = 2 * (y / canvasHeight) - 1;
    };

    previousKeyMap = new Map<number, boolean>();
    currentKeyMap = new Map<number, boolean>();

    isKeyDown(key: number) {
        if (this.currentKeyMap.get(key) == true) {            
            return true;
        }
        return false;
    };

    isKeyPressed(key: number) {
        if (this.isKeyDown(key) == true && this.wasKeyDown(key) == false) {
            return true;
        }
        return false;
    };

    wasKeyDown(key: number) {
        if (this.previousKeyMap.get(key) == true) {
            return true;
        }
        return false;
    };

    setKeyDown(event: KeyboardEvent) {
        this.currentKeyMap.set(event.keyCode, true);
    };

    setKeyUp(event: KeyboardEvent) {
        this.currentKeyMap.set(event.keyCode, false);
    };

    get inputs() {
        let currentState = new InputState();
        currentState.zoom = this.zoom_;
        currentState.mouseX = this.currentMouseX;
        currentState.mouseY = this.currentMouseY;
        currentState.mouseDx = this.centeredMouseX - this.previousMouseX;
        currentState.mouseDy = this.centeredMouseY - this.previousMouseY;

        for (let i in move_set) {
            let move = move_set[i];
            let key = key_bindings.get(move);
            if (this.isKeyDown(key)) {
                currentState.keyDown.push(move);
            }
        }

        for (let i in action_set) {
            let action = action_set[i];
            let key = key_bindings.get(action);
            if (this.isKeyPressed(key)) {
                currentState.keyPressed.push(action);
            }
        }
        return currentState;
    };

    set zoom(value: number) {
        if (value > 0.0) {
            this.zoom_ = 1.0;
        }
        else {
            this.zoom_ = -1.0;
        }
    };

    Update() {
        this.zoom_ = 0.0;

        this.previousMouseX = this.centeredMouseX;
        this.previousMouseY = this.centeredMouseY;

        this.currentMouseX = 0;
        this.currentMouseY = 0;

        this.currentKeyMap.forEach((value, key, map) => {
            this.previousKeyMap.set(key, value);
        });
    };
}