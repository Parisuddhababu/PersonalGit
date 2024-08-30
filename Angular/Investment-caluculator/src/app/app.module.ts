import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { UserInputModule } from './user-input/user-input.module';
import { InvestmentResultsModule } from './investment-results/investment-results.module';
import { HeaderModule } from './header/header.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports:[UserInputModule,InvestmentResultsModule,HeaderModule],
  bootstrap:[AppComponent]
})
export class AppModule {}
