import {Directive, Input} from "@angular/core";

@Directive({
    selector: "[canvasFrame]"
})
export class CanvasFrameDirective {
    @Input() inWidth: number;
    @Input() inHeight: number;
    @Input() inTop: string;
    @Input() inLeft: string;
    
}