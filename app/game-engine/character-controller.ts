import { Injectable } from "@angular/core";

import { InputManager } from "./input-manager";
//import { RenderObject } from "../render-objects/render-object";

@Injectable()
export class CharacterController {

    constructor(private input_manager_: InputManager/*, private render_object_: RenderObject*/) {
        //this.input_manager_.character_actions_inputs.subscribe((action) => {
        //});

        //this.input_manager_.character_movement_inputs.subscribe((move) => {
        //});
    }

    update() {

    };
};