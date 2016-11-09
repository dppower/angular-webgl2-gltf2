import { NgModule, OpaqueToken } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { CanvasModule } from "./canvas/canvas.module";

@NgModule({
    imports: [ BrowserModule, HttpModule, CanvasModule ],
    declarations: [ AppComponent ],
    bootstrap: [ AppComponent ]
})
export class AppModule { };