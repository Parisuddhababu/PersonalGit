import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ManageBannerService {
  constructor(private http: HttpClient) {}

  getAllBannerList(bannerData: any) {
    return this.http.post<any>(CONFIG.getAllBannerListURL, bannerData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  changeManageBannerStatus(status: string, id: number) {
    return this.http
      .post<any>(CONFIG.changeManageBannerStatusURL, { uuid: id, status: status })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deleteManageBanner(id: number) {
    return this.http.delete<any>(CONFIG.deleteManageBannerURL + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getManageBannerById(id: number) {
    return this.http.get<any>(CONFIG.getManageBannerByIdURL + id).pipe(
      map((data) => {
        return data;
      })
    );
  }

  createManageBanner(bannerData: any) {
    return this.http.post<any>(CONFIG.createManageBannerURL, bannerData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updateManageBanner(bannerData: any, id: number) {
    return this.http.post<any>(CONFIG.updateManageBannerURL + id, bannerData).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
