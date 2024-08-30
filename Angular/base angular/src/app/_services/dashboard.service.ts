import { Injectable } from '@angular/core';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}
  getAllTotalCount(data) {
    return this.http.post<any>(CONFIG.getDashboardCountURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
