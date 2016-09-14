import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Rx";

import { CanvasController } from "./canvas-controller.component";
import { InputManager, Actions } from "../game-engine/input-manager";

@Component({
    selector: "menu-button",
    template: `
<div id="menu-button-background"   
    (mousedown)="toggleMenuDisplay($event)"
><p id="menu-button-text">Menu</p></div>
`,
    styles: []
})
export class MenuButton implements OnInit, OnDestroy {

    private display_menu_action_ = Actions.display_menu;
    private ui_inputs_subscription: Subscription;

    constructor(private controller_: CanvasController, private input_manager_: InputManager) { };

    ngOnInit() {
        this.ui_inputs_subscription = this.input_manager_.ui_inputs.subscribe((action) => {
            if (action == this.display_menu_action_) {
                console.log("Toggle menu display.");
                this.toggleMenuDisplay();
            }
        });
    };

    ngOnDestroy() {
        this.ui_inputs_subscription.unsubscribe();
    };

    toggleMenuDisplay(event?: MouseEvent) {
        this.controller_.should_display_menu = !this.controller_.should_display_menu;
    };
};