import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IPaynowApiRequestParam } from '../model/cart';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient) {}

  handlePayNowButtonClick(data: IPaynowApiRequestParam) {
    let options = this.RequestPara();
    const formData = JSON.stringify(data);
    return this.http
      .post<any>(CONFIG.baseUrl, formData, { headers: options })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  RequestPara() {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', 'http://localhost:3000/')
      .set(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS, READ'
      )
      .set(
        'Access-Control-Allow-Headers',
        'Origin, Content-Type, X-Auth-Token,authorization,XMLHttpRequest, user-agent, accept'
      );
    return headers;
  }
}
