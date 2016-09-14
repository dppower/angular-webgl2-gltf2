import { Component } from "@angular/core";
import { InputManager } from "../game-engine/input-manager";

@Component({
    selector: "skill-bar",
    template: `
    <div #skillbar id="skill-bar" [style.height.px]="0.2 * skillbar.clientWidth">
        <skill-button [keybind]="1"></skill-button>
        <skill-button [keybind]="2"></skill-button>
        <skill-button [keybind]="3"></skill-button>
        <skill-button [keybind]="4"></skill-button>
        <skill-button [keybind]="5"></skill-button>
    </div>
    
    `,
    styles: [`
    #skill-bar {
        background-color: light-grey;
        width: 52%;
        position: absolute;
        border: 0.25em solid white;
        bottom: 4%;
        left: 24%;
        margin: 0;     
        z-index: 10;
    }
    `]
})
export class SkillBar {
    constructor(private input_manager_: InputManager) { };
};