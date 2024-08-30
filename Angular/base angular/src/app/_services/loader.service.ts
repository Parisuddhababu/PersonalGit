import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor(private http: HttpClient, private ngxLoader: NgxUiLoaderService) {}

  showLoader() {
    this.ngxLoader.start();
  }
  hideLoader() {
    this.ngxLoader.stop();
  }
}
