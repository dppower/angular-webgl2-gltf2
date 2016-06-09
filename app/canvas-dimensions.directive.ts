import {Directive, Input} from "@angular/core";

@Directive({
    selector: "[canvas-dimensions]"
})
export class CanvasDimensions {
    @Input() inWidth: number;
    @Input() inHeight: number;
    @Input() inTop: string;
    @Input() inLeft: string;
}