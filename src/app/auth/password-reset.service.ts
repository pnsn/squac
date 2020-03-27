import { Injectable } from '@angular/core';
import { SquacApiService } from '../squacapi.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private url = 'password_reset/';
  private token : string;
  constructor(
    private http: HttpClient,
    private squacApi: SquacApiService
  ) {

  }

  resetPassword(email : string) {
    return of(email);
  }

  validateToken(token : string) {
    this.token = token;
    return of(token);
  }

  confirmPassword(password) {
    return of(password, this.token);
  }

  // //send email to squac, it sends token to user
  // resetPassword(email : string) {
  //   return this.squacApi.post(this.url, {
  //       email: email
  //     }
  //   );
  // }

  // // check token is valid
  // validateToken(token : string) {
  //   const path = "validate_token/";
  //   this.token = token;
  //   return this.squacApi.post(this.url + path, {
  //     token: token
  //   });
  // }

  // // send new password
  // confirmPassword(password) {
  //   const path = "validate_token/";

  //   return this.squacApi.post(this.url + path, {
  //     password: password,
  //     token: this.token
  //   });
  // }
}

