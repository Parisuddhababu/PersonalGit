import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ActivityTrackingService {
  constructor(private http: HttpClient) {}

  getAllActivityTrackingList(activityData: any) {
    return this.http.post<any>(CONFIG.getAllActivityTrackingListURL, activityData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  deleteActivity(id: number) {
    return this.http.delete<any>(CONFIG.deleteActivityURL + id).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
