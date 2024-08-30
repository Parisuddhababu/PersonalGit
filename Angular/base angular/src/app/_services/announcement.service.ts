import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  constructor(private http: HttpClient) {}

  getAllAnnouncementList(AnnouncementData: any) {
    return this.http.post<any>(CONFIG.getAllAnnouncementListURL, AnnouncementData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  createAnnouncement(AnnouncementData: any) {
    return this.http.post<any>(CONFIG.createAnnouncementURL, AnnouncementData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getAnnouncementDetailsById(AnnouncementData: any) {
    return this.http.post<any>(CONFIG.getAnnouncementDetailsByIdURL, AnnouncementData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getAnnouncementUserData(AnnouncementData: any) {
    return this.http.post<any>(CONFIG.getAnnouncementUserDataURL, AnnouncementData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getAnnouncementUserSelectionList(AnnouncementData: any) {
    return this.http.post<any>(CONFIG.getAnnouncementUserSelectionListURL, AnnouncementData).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
