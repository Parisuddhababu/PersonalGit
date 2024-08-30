import { Component, NgModule, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LoaderComponent } from './loader.component';

@NgModule({
  imports: [NgxUiLoaderModule],
  declarations: [LoaderComponent],
  exports: [LoaderComponent],
})
export class LoaderModule {
  static forRoot() {
    return {
      NgModule: LoaderModule,
    };
  }
}
