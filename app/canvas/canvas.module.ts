import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Modules
import { Webgl2Module } from "../webgl2/webgl2.module";
// Components
import { MainCanvas } from "./main-canvas.component";
import { SkillBar } from "./skill-bar.component";
import { SkillButton } from "./skill-button.component";
import { MenuButton} from "./menu-button.component";
import { MenuDisplay } from "./menu-display.component";
import { SkillLog } from "./skill-log.component";
// Directives
import { CanvasController } from "./canvas-controller.directive";
// Providers
import { InputManager } from "../game-engine/input-manager";
import { RenderLoop } from "../game-engine/render-loop";

@NgModule({
    imports: [ CommonModule, Webgl2Module ],
    declarations: [
        MainCanvas, CanvasController,
        SkillBar, SkillButton, MenuButton, MenuDisplay, SkillLog
    ],
    providers: [ InputManager, RenderLoop ],
    exports: [ MainCanvas ]
})
export class CanvasModule { };