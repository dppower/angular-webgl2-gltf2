import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { CanvasModule } from "./canvas/canvas.module";

@NgModule({
    imports: [ BrowserModule, HttpClientModule, CanvasModule ],
    declarations: [ AppComponent ],
    bootstrap: [ AppComponent ]
})
export class AppModule { };