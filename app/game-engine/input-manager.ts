import { Injectable } from "@angular/core";
//import { Subject } from "rxjs/Subject";

import { Vec2, Vec2_T } from "../game-engine/vec2";

//export enum Actions {
//    forward,
//    back,
//    left,
//    right,
//    jump,
//    action_1,
//    action_2,
//    action_3,
//    action_4,
//    action_5,
//    display_menu
//};

export interface InputState {
    forward: boolean,
    back: boolean,
    left: boolean,
    right: boolean,
    jump: boolean,
    action_1: boolean,
    action_2: boolean,
    action_3: boolean,
    action_4: boolean,
    action_5: boolean,
    display_menu: boolean
};

export type InputTypes = keyof InputState;

const InitialInputState: InputState = {
    forward: false,
    back: false,
    left: false,
    right: false,
    jump: false,
    action_1: false,
    action_2: false,
    action_3: false,
    action_4: false,
    action_5: false,
    display_menu: false
};

export interface PointerState {
    left: boolean;
    right: boolean;
    wheel: number;
    position: Vec2;
    delta: Vec2;
};

const InitialPointerState: PointerState = {
    left: false,
    right: false,
    wheel: 0,
    position: new Vec2(),
    delta: new Vec2()
};

//export interface CameraInputs {
//    wheel_direction: number;
//    screen_movement: Vec2
//};

@Injectable()
export class InputManager {

    get aspect() {
        return this.current_aspect_ratio_ || 1.5;
    };

    set aspect(value: number) {
        this.current_aspect_ratio_ = value;
    };

    get delta() {
        return this.current_pointer_state_.delta;
    };

    get position() {
        return this.current_pointer_state_.position;
    };

    get wheel() {
        return this.current_pointer_state_.wheel;
    };

    private previous_key_state_: InputState;
    private current_key_state_: InputState;

    private previous_pointer_state_: PointerState;
    private current_pointer_state_: PointerState;

    //set_mouse_target = new Subject<Vec2>();

    //camera_inputs = new Subject<CameraInputs>();

    //ui_inputs = new Subject<Actions>();

    //character_movement_inputs = new Subject<Actions>();

    //character_actions_inputs = new Subject<Actions>();

    private current_key_bindings_ = new Map<string, InputTypes>();

    private current_aspect_ratio_: number;
    //private wheel_direction_ = 0.0;
    //private pointer_movement_ = new Vec2();
    //private current_pointer_position_ = new Vec2();

    //private previous_key_state_ = new Map<Actions, boolean>();
    //private current_key_state_ = new Map<Actions, boolean>();

    //private previous_mouse_button_state_ = { left: false, right: false };
    //private current_mouse_button_state_ = { left: false, right: false };

    constructor() {
        // Initialise state
        this.previous_key_state_ = Object.assign({}, InitialInputState);
        this.current_key_state_ = Object.assign({}, InitialInputState);
        this.previous_pointer_state_ = Object.assign({}, InitialPointerState);
        this.current_pointer_state_ = Object.assign({}, InitialPointerState);
        // set default key code bindings
        //this.current_key_bindings_.set("KeyW", Actions.forward);
        //this.current_key_bindings_.set("KeyS", Actions.back);
        //this.current_key_bindings_.set("KeyA", Actions.left);
        //this.current_key_bindings_.set("KeyD", Actions.right);
        //this.current_key_bindings_.set("Space", Actions.jump);
        //this.current_key_bindings_.set("Digit1", Actions.action_1);
        //this.current_key_bindings_.set("Digit2", Actions.action_2);
        //this.current_key_bindings_.set("Digit3", Actions.action_3);
        //this.current_key_bindings_.set("Digit4", Actions.action_4);
        //this.current_key_bindings_.set("Digit5", Actions.action_5);
        //this.current_key_bindings_.set("Escape", Actions.display_menu);
        this.current_key_bindings_.set("KeyW", "forward");
        this.current_key_bindings_.set("KeyS", "back");
        this.current_key_bindings_.set("KeyA", "left");
        this.current_key_bindings_.set("KeyD", "right");
        this.current_key_bindings_.set("Space", "jump");
        this.current_key_bindings_.set("Digit1", "action_1");
        this.current_key_bindings_.set("Digit2", "action_2");
        this.current_key_bindings_.set("Digit3", "action_3");
        this.current_key_bindings_.set("Digit4", "action_4");
        this.current_key_bindings_.set("Digit5", "action_5");
        this.current_key_bindings_.set("Escape", "display_menu");
    };

    setMousePosition(position: Vec2_T) {
        //if (this.isButtonDown("right")) {
        //    this.pointer_movement_ = this.pointer_movement_.add(updated_coords.subtract(this.current_pointer_position_));
        //}
        //this.current_pointer_position_.copy(updated_coords);       
        let current_delta = Vec2.subtract(position, this.previous_pointer_state_.position);
        this.current_pointer_state_.position.copy(position);
        this.current_pointer_state_.delta.copy(current_delta);
    };

    setWheelDirection(value: 1 | -1) {
        //if (value > 0.0) {
        //    this.wheel_direction_ = 1.0;
        //}
        //else {
        //    this.wheel_direction_ = -1.0;
        //}
        this.current_pointer_state_.wheel = value;
    };

    /**
     * @param key = KeyboardEvent.code || KeyboardEvent.key
     */
    setKeyDown(key: string) {
        //let action = this.current_key_bindings_.get(key_code);
        //if (action != undefined) {
        //    this.current_key_state_.set(action, true);
        //}
        let code = this.parseKeyCode(key);
        let action = this.current_key_bindings_.get(code);
        if (action != undefined) {
            this.current_key_state_[action] = true;
        }
    };

    /**
     * @param key = KeyboardEvent.code
     */
    setKeyUp(key: string) {
        //let action = this.current_key_bindings_.get(key_code);
        //if (action != undefined) {
        //    this.current_key_state_.set(action, false);
        //}
        let code = this.parseKeyCode(key);
        let action = this.current_key_bindings_.get(code);
        if (action != undefined) {
            this.current_key_state_[action] = false;
        }
    };

    parseKeyCode(key_code: string) {
        let code = key_code;
        if (key_code === " ") {
            code = "Space";
        }
        else {
            let first = key_code.charAt(0);
            if (first !== "K" && first !== "S") {
                code = "Key" + key_code.toUpperCase();
            }
        }
        return code;
    };
    
    isKeyDown(action: InputTypes) {
        //if (this.current_key_state_.get(action) == true) {            
        //    return true;
        //}
        //return false;
        return this.current_key_state_[action];
    };

    wasKeyDown(action: InputTypes) {
        //if (this.previous_key_state_.get(action) == true) {
        //    return true;
        //}
        //return false;
        return this.previous_key_state_[action];
    };

    isKeyPressed(action: InputTypes) {
        if (this.isKeyDown(action) === true && this.wasKeyDown(action) === false) {
            return true;
        }
        return false;
    };

    wasKeyReleased(action: InputTypes) {
        if (this.isKeyDown(action) === false && this.wasKeyDown(action) === true) {
            return true;
        }
        return false;
    };

    /**
     * Set the current state of the mouse buttons, called by canvas controller
     * @param button
     * @param state
     */
    setMouseButton(button: "left" | "right", state: boolean) {
        this.current_pointer_state_[button] = state;
    };

    isButtonDown(button: "left" | "right") {
        //if (this.current_mouse_button_state_[button] == true) {
        //    return true;
        //}
        //return false;
        return this.current_pointer_state_[button];
    };

    wasButtonDown(button: "left" | "right") {
        //if (this.previous_mouse_button_state_[button] == true) {
        //    return true;
        //}
        //return false;
        return this.previous_pointer_state_[button];
    };

    isButtonPressed(button: "left" | "right") {
        if (this.isButtonDown(button) === true && this.wasButtonDown(button) === false) {
            return true;
        }
        return false;
    };

    wasButtonReleased(button: "left" | "right") {
        if (!this.isButtonDown(button) && this.wasButtonDown(button)) {
            return true;
        }
        return false;
    };

    //setMouseButton(button: string, state: boolean) {
    //    this.current_mouse_button_state_[button] = state;
    //};

    update() {
        // Reset inputs
        for (let input in this.current_key_state_) {
            this.previous_key_state_[input] = this.current_key_state_[input];
        }

        this.previous_pointer_state_["left"] = this.current_pointer_state_["left"];
        this.previous_pointer_state_["right"] = this.current_pointer_state_["right"];
        this.previous_pointer_state_["wheel"] = this.current_pointer_state_["wheel"];
        this.previous_pointer_state_["position"].copy(this.current_pointer_state_["position"]);
        this.previous_pointer_state_["delta"].copy(this.current_pointer_state_["delta"]);

        this.current_pointer_state_["delta"].setZero();
        this.current_pointer_state_.wheel = 0;
        // Emit events
        //let pointer_movement = (this.isButtonDown("right")) ? this.current_pointer_position_.subtract(this.previous_pointer_position_) : new Vec2();
        //let current_camera_inputs: CameraInputs = { wheel_direction: this.wheel_direction_, screen_movement: this.pointer_movement_ };
        //this.camera_inputs.next(current_camera_inputs);

        //if (this.isButtonPressed("left")) {
        //    this.set_mouse_target.next(this.current_pointer_position_);
        //};

        //this.current_key_state_.forEach((value, action, map) => {
        //    if (value) {
        //        switch (action) {
        //            case Actions.forward:
        //            case Actions.back:
        //            case Actions.left:
        //            case Actions.right:
        //                this.character_movement_inputs.next(action);
        //                break;
        //            case Actions.jump:
        //            case Actions.action_1:
        //            case Actions.action_2:
        //            case Actions.action_3:
        //            case Actions.action_4:
        //            case Actions.action_5:
        //                if (this.isKeyPressed(action)) {
        //                    this.character_actions_inputs.next(action);
        //                }
        //                break;
        //            case Actions.display_menu:
        //                if (this.isKeyPressed(action)) {
        //                    this.ui_inputs.next(action);
        //                }
        //                break;
        //        }
        //    }
        //    // Update previous key state
        //    this.previous_key_state_.set(action, value);
        //});

        //// Reset inputs
        //this.wheel_direction_ = 0.0;
        ////this.previous_pointer_position_.copy(this.current_pointer_position_);
        //this.pointer_movement_ = new Vec2();

        //this.previous_mouse_button_state_["left"] = this.current_mouse_button_state_["left"];
        //this.previous_mouse_button_state_["right"] = this.current_mouse_button_state_["right"];
    };

    //dispose() {
    //    this.ui_inputs.complete();
    //};
}