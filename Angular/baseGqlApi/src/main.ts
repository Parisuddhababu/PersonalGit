import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment.prod';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers:[provideRouter(routes),provideHttpClient(),
     ],
}).catch((err) => console.error(err));
