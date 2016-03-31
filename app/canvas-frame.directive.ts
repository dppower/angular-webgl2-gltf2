import {Directive, Input, OnChanges, SimpleChange} from "angular2/core";

@Directive({
    selector: "[canvasFrame]"
})
export class CanvasFrameDirective implements OnChanges {
    @Input() inWidth: number;
    @Input() inHeight: number;
    @Input() inTop: string;
    @Input() inLeft: string;

    ngOnChanges(changes: { [input: string]: SimpleChange }) {
        if (changes["inWidth"] || changes["inHeight"]) {
            console.log("width: " + this.inWidth + ", height: " + this.inHeight + ".");
        }
    };
}