import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CONFIG } from '../config/app-config';
import { Manageuser } from './../model/manageuser';

@Injectable({
  providedIn: 'root',
})
export class ManageuserService {
  constructor(private http: HttpClient) { }

  getAllManageUserListURL(ManageuserData: any) {
    return this.http.post<any>(CONFIG.getAllManageUserListURL, ManageuserData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getExportUserList(ManageuserData: any, type: string) {
    let route = CONFIG.exportUsersExcelURL;
    if (type === 'pdf') {
      route = CONFIG.exportUsersPDFURL;
    } else if (type === 'csv') {
      route = CONFIG.exportUsersCSVURL;
    }
    return this.http.post<any>(route, ManageuserData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getManagerUserById(id: number) {
    return this.http.get<any>(CONFIG.getManagerUserByIdURL + id).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getSampleUserImportFile() {
    return this.http.get<any>(CONFIG.downloadSampleImportFileURL).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateManageUser(ManageuserData: any, id: number) {
    return this.http.post<any>(CONFIG.updateManageUserURL + id, ManageuserData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  createManageUser(ManageuserData: Manageuser) {
    return this.http.post<any>(CONFIG.createManageUserURL, ManageuserData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  changeManageUserPassword(ManageuserData: any) {
    return this.http.post<any>(CONFIG.changeManageUserPassURL, ManageuserData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  changeManageUserStatus(status: string, id: number) {
    return this.http
      .put<any>(CONFIG.changeManageUserStatusURL, { id: id, status: status })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deleteManageUser(id: number) {
    return this.http.delete<any>(CONFIG.deleteManageUserURL + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

  lockManageUser(id: number) {
    return this.http
      .post<any>(CONFIG.lockManageUserURL, { lockable_id: id, lockable_type: 'user' })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  unlockManageUser(id: number, is_self_locked: number) {
    return this.http
      .post<any>(CONFIG.unlockManageUserURL, { lockable_id: id, lockable_type: 'user', is_self_locked: is_self_locked })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deleteUserProfile(id: any) {
    return this.http.get<any>(CONFIG.deleteUserProfileURL + id).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getActiveCategoryList(id) {
    return this.http.get<any>(CONFIG.getActiveCategoryListURL + id).pipe(
      map((data) => {
        return data;
      })
    );
  }
  importCSVFile(formData: any) {
    return this.http.post<any>(CONFIG.importCSVFileURL, formData).pipe(
      map((response) => {
        return response;
      })
    );
  }
  checkPassword(pass) {
    if (pass !== null) {
      return (pass as string).replace(/\*/g, '[*]').replace(/\^/g, '[^]').replace(/\$/g, '[$]');
    }
  }
  // Trim text for space issue
  trimText(str) {
    if (str) {
      return str.trim();
    } else {
      return '';
    }
  }
}
