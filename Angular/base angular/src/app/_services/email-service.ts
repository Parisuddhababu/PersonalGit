import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CONFIG } from '../config/app-config';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) { }

  getAllEmailList() {
    return this.http.post<any>(CONFIG.getAllEmailListURL, {}).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getEmailById(id: number) {
    return this.http.get<any>(CONFIG.getEmailByIdURL + id).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateEmail(emailData: any, id: number) {
    return this.http.put<any>(CONFIG.updateEmailURL + id, emailData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  changeEmailStatus(status: string, id: number) {
    return this.http
      .put<any>(CONFIG.changeEmailStatusURL, { id: id, status: status })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
