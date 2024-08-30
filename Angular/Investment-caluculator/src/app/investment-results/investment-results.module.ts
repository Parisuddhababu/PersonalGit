import { NgModule } from "@angular/core";
import { InvestmentResultsComponent } from "./investment-results.component";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
    declarations:[InvestmentResultsComponent],
    imports:[BrowserModule],
    exports:[InvestmentResultsComponent]
})
export class InvestmentResultsModule{}