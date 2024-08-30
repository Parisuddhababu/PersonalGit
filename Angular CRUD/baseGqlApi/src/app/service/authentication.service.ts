import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Login, RefreshToken } from '../framework/mutation/login';

import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private apollo: Apollo) {}
  login(email: string, password: string) {
    return this.apollo
      .mutate({
        mutation: Login,
        variables: {
          email: email,
          password: password,
        },
      })
      .pipe(
        map((result: any) => {
          const token = result?.data?.loginUser?.data?.token;
          const accessToken=result?.data?.loginUser?.data?.refreshToken;
          if (token && typeof window !== 'undefined') {
            localStorage.setItem('token', token);
            localStorage.setItem('accessToken', accessToken);
          }
          return token;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
  generateRefreshToken() {
    const refreshToken = localStorage.getItem('accessToken');
    if (refreshToken) {
      return this.apollo.mutate({
        mutation: RefreshToken,
        variables: {
          refreshToken: refreshToken,
        },
      }).pipe(
        map((result: any) => result?.data?.generateRefreshToken?.data?.token),
        catchError(error => {
          return throwError(error);
        })
      );
    } else {
      throw new Error('No refresh token available');
    }
  }
}
