import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { createApollo, graphqlProvider } from './framework/graphql/apollo.provider';

import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/cache';
import { environment } from '../environments/environment.prod';
const uri = `${environment.API_Url}`;

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    
  ],
  providers: [
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
