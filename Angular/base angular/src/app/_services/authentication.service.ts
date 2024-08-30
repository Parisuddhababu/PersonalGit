import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';
import { EncrDecrService } from './encr-decr.service';
import { MultilingualService } from './multilingual.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private loggedInStatus = false;

  constructor(private http: HttpClient, private EncrDecr: EncrDecrService, private multilingualService: MultilingualService) {}

  setLoggedIn(value: boolean) {
    this.loggedInStatus = value;
  }

  get isLoggedIn() {
    return this.loggedInStatus;
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(CONFIG.userAuthURL, { email: email, password: password, role: 'ADMIN' })
      .pipe(
        map((user) => {
          // login successful if there's a jwt token in the response
          if (user.data && user.meta && user.meta.status === true) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            const encrypted = this.EncrDecr.set(CONFIG.EncrDecrKey, user.data);
            localStorage.setItem('currentUser', encrypted);
            const firstName = user.data.user_detail.first_name ? user.data.user_detail.first_name : '';
            const lastName = user.data.user_detail.last_name ? user.data.user_detail.last_name : '';
            localStorage.setItem('fullName', firstName + ' ' + lastName);
            const languages = user.data.user_detail.languages;
            this.multilingualService.saveLanguage(languages);
          }
          return user;
        })
      );
  }

  forgotPassword(email: string) {
    return this.http
      .post<any>(CONFIG.forgotPassURL, { email: email, role: 'ADMIN' })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('fullName');
    localStorage.removeItem('languages');
    // For remove all module sorting, pagination and filter session
    sessionStorage.clear();
  }

  validateResetPass(token) {
    return this.http
      .post<any>(CONFIG.validateResetPassURL, { token: token })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  resetPass(token: string, password: string, cPassword: string) {
    return this.http
      .put<any>(CONFIG.resetPassURL, { new_password: password, confirm_password: cPassword, token: token })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getPermissions() {
    let currentUserPermissions = [];
    const decrypted = localStorage.getItem('currentUser');
    const currentUser = this.EncrDecr.get(CONFIG.EncrDecrKey, decrypted);
    if (currentUser) {
      const currentUserJson = JSON.parse(currentUser);
      currentUserPermissions = currentUserJson.user_detail.permission || [];
    }
    return currentUserPermissions;
  }
}
