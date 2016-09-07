import { Directive, Input } from "@angular/core";

@Directive({
    selector: "[canvas-frame]"
})
export class CanvasFrame {
    @Input() frameWidth: number;
    @Input() frameHeight: number;
    @Input() frameTop: string;
    @Input() frameLeft: string;
}