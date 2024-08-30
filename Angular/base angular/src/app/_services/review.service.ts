import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private http: HttpClient) {}
  getReviewList(data: any) {
    return this.http.post<any>(CONFIG.getReviewListURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  deleteReview(id: number) {
    return this.http.delete<any>(CONFIG.deleteReviewURL + id).pipe(
      map((data) => {
        return data;
      })
    );
  }
  changeReviewStatus(status: string, id: number) {
    return this.http
      .post<any>(CONFIG.changeReviewStatusURL, { id: id, status: status })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
