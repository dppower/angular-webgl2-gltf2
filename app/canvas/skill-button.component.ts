import { Component, Input } from "@angular/core";

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
    constructor() { };

    handleMouseDown(event: MouseEvent) {
        event.stopPropagation();
        let div = (<HTMLDivElement>event.target);
        console.log(`skill button: ${this.keybind}, event target: ${div.id}`);
    }
};