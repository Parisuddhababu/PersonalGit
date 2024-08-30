import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}
  getUserReportList(data: any) {
    return this.http.post<any>(CONFIG.getUserReportListURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  deleteUserReport(id: number) {
    return this.http.delete<any>(CONFIG.deleteUserReportURL + id).pipe(
      map((data) => {
        return data;
      })
    );
  }
  changeReportStatus(status: string, id: number) {
    return this.http
      .post<any>(CONFIG.changeReportStatusURL, { id: id, status: status })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
