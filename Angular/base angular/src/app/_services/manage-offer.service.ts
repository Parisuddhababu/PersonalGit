import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ManageOfferService {
  constructor(private http: HttpClient) {}

  getAllManageOfferList(manageOffer: any) {
    return this.http.post<any>(CONFIG.getAllManageOfferListURL, manageOffer).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updateManageOffer(manageOffer: any, id: number) {
    return this.http.put<any>(CONFIG.updateManageOfferURL + id, manageOffer).pipe(
      map((response) => {
        return response;
      })
    );
  }

  createManageOffer(manageOffer: any) {
    return this.http.post<any>(CONFIG.createManageOfferURL, manageOffer).pipe(
      map((response) => {
        return response;
      })
    );
  }

  changeManageOfferStatus(status: string, id: number) {
    return this.http
      .put<any>(CONFIG.changeManageOfferStatusURL + id, { status: status })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deleteManageOffer(id: number) {
    return this.http.delete<any>(CONFIG.deleteManageOfferURL + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getManageOfferById(id: number) {
    return this.http.get<any>(CONFIG.getManageOfferByIdURL + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   *
   * @param data fetch User data for common users List Used
   */
  getActiveUser() {
    return this.http.get<any>(CONFIG.getActiveUserURL).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getExportOfferList(data: any, type: string) {
    let route = CONFIG.exportOfferExcelURL;
    if (type === 'pdf') {
      route = CONFIG.exportOfferPDFURL;
    } else if (type === 'csv') {
      route = CONFIG.exportOfferCSVURL;
    }
    return this.http.post<any>(route, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getOfferReportListURL(uuid, data: any) {
    return this.http.post<any>(CONFIG.getOfferReportListURL + uuid, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getExportUserList(data: any, type: string) {
    let route = CONFIG.exportUserExcelURL;
    if (type === 'pdf') {
      route = CONFIG.exportUserPDFURL;
    } else if (type === 'csv') {
      route = CONFIG.exportUserCSVURL;
    }
    return this.http.post<any>(route, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
