import { Directive, Input, OnChanges, SimpleChanges } from "@angular/core";

@Directive({
    selector: "[canvas-frame]"
})
export class CanvasFrame {
    @Input() frameWidth: number;
    @Input() frameHeight: number;
    @Input() frameTop: string;
    @Input() frameLeft: string;

    resizing = false;

    ngOnChanges(changes: SimpleChanges) {
        if (changes["frameWidth"] || changes["frameHeight"]) {
            this.resizing = true;
        }
    };
}