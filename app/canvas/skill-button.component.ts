import { Component, Input } from "@angular/core";

import { InputManager/*, Actions*/ } from "../game-engine/input-manager";

@Component({
    selector: "skill-button",
    template: `
    <div class="skill-button" (mousedown)="handleMouseDown($event)">
        <p>{{keybind}}</p>
    </div>
    `,
    styles: [`
    .skill-button {
        color: cyan;
        font-size: 16px;
        display: inline-block;
        float: left;
        width: 20%;
        height: 100%;
        border: 0.25em solid white;
        margin: 0;     
        z-index: 15;
    }
    `]
})
export class SkillButton {
    @Input() keybind: string;
    // Get appropriate skill icon for img src
    constructor(private input_manager_: InputManager) { };

    handleMouseDown(event: MouseEvent) {
        event.stopPropagation();
        let div = (<HTMLDivElement>event.target);
        console.log(`skill button: ${this.keybind}, event target: ${div.id}`);

        //let action = Actions[`action_${this.keybind}`];
        //console.log(`action_id: ${action}.`);

        //this.input_manager_.character_actions_inputs.next(action);
    }
};