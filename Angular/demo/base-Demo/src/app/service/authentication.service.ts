import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Login } from '../framework/mutation/login';

import { map } from 'rxjs/operators';


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
          
          if (token) {
            localStorage.setItem('accessToken', token);
          }
          return token;
        })
      );
  }
}
