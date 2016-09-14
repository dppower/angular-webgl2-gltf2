import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Webgl2Module } from "./webgl2.module";
import { CanvasController } from "./canvas-controller.component";
import { MainCanvas } from "./main-canvas.component";
import { CanvasFrame } from "./canvas-frame.directive";
import { SkillBar } from "./skill-bar.component";
import { SkillButton } from "./skill-button.component";
import { MenuButton} from "./menu-button.component";
import { MenuDisplay } from "./menu-display.component";
import { SkillLog } from "./skill-log.component";

@NgModule({
    imports: [Webgl2Module, CommonModule],
    declarations: [ MainCanvas, CanvasController, CanvasFrame, SkillBar, SkillButton, MenuButton, MenuDisplay, SkillLog ],
    exports: [ MainCanvas, CanvasController ]
})
export class CanvasModule { };