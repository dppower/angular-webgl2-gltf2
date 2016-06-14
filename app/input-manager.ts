import {Injectable} from "@angular/core";

var keyBindings = new Map<string, number>();
keyBindings.set("forward", 69);
keyBindings.set("back", 68);
keyBindings.set("left", 83);
keyBindings.set("right", 70);
keyBindings.set("jump", 32);

const moveSet = ["forward", "back", "left", "right"];
const actionSet = ["jump"];

export class InputState {
    aspect = 1.78;
    zoom = 0.0;
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

    currentMouseX = 0.0;
    currentMouseY = 0.0;

    setMouseCoords(x: number, y: number, canvasWidth: number, canvasHeight: number) {
        this.currentMouseX = 2 * (x / canvasWidth) - 1;
        this.currentMouseY = 2 * (y / canvasHeight) - 1;
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
        currentState.mouseDx = this.currentMouseX - this.previousMouseX;
        currentState.mouseDy = this.currentMouseY - this.previousMouseY;

        for (let i in moveSet) {
            let move = moveSet[i];
            let key = keyBindings.get(move);
            if (this.isKeyDown(key)) {
                currentState.keyDown.push(move);
            }
        }

        for (let i in actionSet) {
            let action = actionSet[i];
            let key = keyBindings.get(action);
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

        this.previousMouseX = this.currentMouseX;
        this.previousMouseY = this.currentMouseY;

        this.currentKeyMap.forEach((value, key, map) => {
            this.previousKeyMap.set(key, value);
        });
    };
}