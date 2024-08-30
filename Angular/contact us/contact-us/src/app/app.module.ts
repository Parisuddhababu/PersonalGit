import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { ContactUsModule } from "./contact-us/contact-us.module";
import { ContactUsComponent } from "./contact-us/contact-us.component";

@NgModule({
    declarations: [
      AppComponent,
    ],
    bootstrap: [AppComponent],
    imports: [BrowserModule,ContactUsModule],
  })
  export class AppModule {}