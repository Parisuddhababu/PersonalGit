import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CONFIG } from '../config/app-config';

@Injectable({
  providedIn: 'root',
})
export class ManageSubscriptionService {
  constructor(private http: HttpClient) {}

  getAllManageSubscriptionList(SubscriptionData: any) {
    return this.http.post<any>(CONFIG.getAllManageSubscrptionListURL, SubscriptionData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getManagerSubscriptionById(id: number) {
    return this.http.get<any>(CONFIG.getManagerSubscriptionByIdURL + id).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateManageSubscription(SubscriptionData: any, id: number) {
    return this.http.put<any>(CONFIG.updateManageSubscriptionURL + id, SubscriptionData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  createManageSubscription(SubscriptionData: any) {
    return this.http.post<any>(CONFIG.createManageSubscriptionURL, SubscriptionData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  changeManageSubscriptionStatus(status: string, id: number) {
    return this.http
      .post<any>(CONFIG.changeManageSubscriptionStatusURL, { uuid: id, status: status })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deleteManageSubscription(id: number) {
    return this.http.delete<any>(CONFIG.deleteManageSubscriptionURL + id).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
