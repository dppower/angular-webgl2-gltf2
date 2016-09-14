import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Rx";

import { Vec2 } from "../game-engine/vec2";

export enum Actions {
    forward,
    back,
    left,
    right,
    jump,
    action_1,
    action_2,
    action_3,
    action_4,
    action_5,
    display_menu
};

export interface CameraInputs {
    wheel_direction: number;
    screen_movement: Vec2
};

@Injectable()
export class InputManager {
    
    set_mouse_target = new Subject<Vec2>();

    camera_inputs = new Subject<CameraInputs>();

    ui_inputs = new Subject<Actions>();

    character_movement_inputs = new Subject<Actions>();

    character_actions_inputs = new Subject<Actions>();

    private current_key_bindings_ = new Map<string, Actions>();

    private wheel_direction_ = 0.0;
    private previous_pointer_position_ = new Vec2();
    private current_pointer_position_ = new Vec2();

    private previous_key_state_ = new Map<Actions, boolean>();
    private current_key_state_ = new Map<Actions, boolean>();

    private previous_mouse_button_state_ = { left: false, right: false };
    private current_mouse_button_state_ = { left: false, right: false };

    constructor() {
        // set default key code bindings
        this.current_key_bindings_.set("KeyW", Actions.forward);
        this.current_key_bindings_.set("KeyS", Actions.back);
        this.current_key_bindings_.set("KeyA", Actions.left);
        this.current_key_bindings_.set("KeyD", Actions.right);
        this.current_key_bindings_.set("Space", Actions.jump);
        this.current_key_bindings_.set("Digit1", Actions.action_1);
        this.current_key_bindings_.set("Digit2", Actions.action_2);
        this.current_key_bindings_.set("Digit3", Actions.action_3);
        this.current_key_bindings_.set("Digit4", Actions.action_4);
        this.current_key_bindings_.set("Digit5", Actions.action_5);
        this.current_key_bindings_.set("Escape", Actions.display_menu);      
    };

    setPointerCoords(coords: Vec2) {
        this.current_pointer_position_.copy(coords);
    };

    setWheelDirection(value: number) {
        if (value > 0.0) {
            this.wheel_direction_ = 1.0;
        }
        else {
            this.wheel_direction_ = -1.0;
        }
    };

    isKeyDown(action: Actions) {
        if (this.current_key_state_.get(action) == true) {            
            return true;
        }
        return false;
    };


    wasKeyDown(action: Actions) {
        if (this.previous_key_state_.get(action) == true) {
            return true;
        }
        return false;
    };

    isKeyPressed(action: Actions) {
        if (this.isKeyDown(action) == true && this.wasKeyDown(action) == false) {
            return true;
        }
        return false;
    };

    isButtonDown(button: string) {
        if (this.current_mouse_button_state_[button] == true) {
            return true;
        }
        return false;
    };


    wasButtonDown(button: string) {
        if (this.previous_mouse_button_state_[button] == true) {
            return true;
        }
        return false;
    };

    isButtonPressed(button: string) {
        if (this.isButtonDown(button) == true && this.wasButtonDown(button) == false) {
            return true;
        }
        return false;
    };

    /**
     * @param key_code = KeyboardEvent.code
     */
    setKeyDown(key_code: string) {
        let action = this.current_key_bindings_.get(key_code);
        if (action != undefined) {
            this.current_key_state_.set(action, true);
        }
    };

    /**
     * @param key_code = KeyboardEvent.code
     */
    setKeyUp(key_code: string) {
        let action = this.current_key_bindings_.get(key_code);
        if (action != undefined) {
            this.current_key_state_.set(action, false);
        }
    };

    setMouseButton(button: string, state: boolean) {
        this.current_mouse_button_state_[button] = state;
    };

    update() {
        // Emit events
        let pointer_movement = this.isButtonDown("right") ? this.current_pointer_position_.subtract(this.previous_pointer_position_) : new Vec2();
        let current_camera_inputs: CameraInputs = { wheel_direction: this.wheel_direction_, screen_movement: pointer_movement };
        this.camera_inputs.next(current_camera_inputs);

        if (this.isButtonPressed("left")) {
            this.set_mouse_target.next(this.current_pointer_position_);
        };

        this.current_key_state_.forEach((value, action, map) => {
            if (value) {
                switch (action) {
                    case Actions.forward:
                    case Actions.back:
                    case Actions.left:
                    case Actions.right:
                        this.character_movement_inputs.next(action);
                        break;
                    case Actions.jump:
                    case Actions.action_1:
                    case Actions.action_2:
                    case Actions.action_3:
                    case Actions.action_4:
                    case Actions.action_5:
                        if (this.isKeyPressed(action)) {
                            this.character_actions_inputs.next(action);
                        }
                        break;
                    case Actions.display_menu:
                        if (this.isKeyPressed(action)) {
                            this.ui_inputs.next(action);
                        }
                        break;
                }
            }
            // Update previous key state
            this.previous_key_state_.set(action, value);
        });

        // Reset inputs
        this.wheel_direction_ = 0.0;
        this.previous_pointer_position_.copy(this.current_pointer_position_);

        this.previous_mouse_button_state_["left"] = this.current_mouse_button_state_["left"];
        this.previous_mouse_button_state_["right"] = this.current_mouse_button_state_["right"];
    };

    dispose() {
        this.ui_inputs.complete();
    };
}