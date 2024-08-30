import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ManagecontactService {
  constructor(private http: HttpClient) {}

  getAllContactList(filterData: any) {
    return this.http.post<any>(CONFIG.getAllContactListURL, filterData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  deleteContact(id: number) {
    return this.http.delete<any>(CONFIG.deleteContactURL + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

  changeStatus(data: any) {
    return this.http.post<any>(CONFIG.changeStatusContactListURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
