import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
  
})
export class ContactUsService {
  constructor(private http: HttpClient) {}

  submitForm(formData: any): Observable<any> {
    return this.http.post(environment.API_Url, formData);
  }
}
