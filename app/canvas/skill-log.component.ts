import { Component } from "@angular/core";

import { InputManager } from "../game-engine/input-manager";

const actions = [
    "forward",
    "back",
    "left",
    "right",
    "jump",
    "action_1",
    "action_2",
    "action_3",
    "action_4",
    "action_5",
    "display_menu"
];

@Component({
    selector: "skill-log",
    template: `<p>move: {{current_move}}, action: {{current_action}}</p>`,
    styles: [`
    `]
})
export class SkillLog {
    current_action = "";
    current_move = "";

    constructor(private input_manager_: InputManager) {
        this.input_manager_.character_actions_inputs.subscribe((action) => {
            this.current_action = actions[action];
            console.log("action: " + actions[action]);
        });

        this.input_manager_.character_movement_inputs.subscribe((move) => {
            this.current_move = actions[move];
            console.log("move: " + actions[move]);
        });
    };
};