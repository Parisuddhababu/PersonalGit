import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient,withFetch } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment.prod';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';
if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers:[provideRouter(routes),provideHttpClient(withFetch()), provideAnimations(), 
    provideToastr(),
     ],
}).catch((err) => console.error(err));
