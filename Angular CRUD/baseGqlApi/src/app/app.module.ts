import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { provideHttpClient, withFetch,HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/cache';
import { environment } from '../environments/environment.prod';
import { ToastrModule } from 'ngx-toastr';
import { BannerComponent } from './views/banner/banner.component';
import { AddBannerComponent } from './views/banner/add-banner/add-banner.component';
const uri = `${environment.API_Url}`;
@NgModule({
  declarations: [AppComponent, LoginComponent,BannerComponent,AddBannerComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    provideHttpClient(withFetch()),
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: uri
          })
        }
      },
      deps: [HttpLink]
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
