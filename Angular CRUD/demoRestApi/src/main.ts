import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from './environments/environment.prod';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ApplicationConfig, enableProdMode,importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';

if (environment.production) {
  enableProdMode();
}
const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      })
    ),
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));