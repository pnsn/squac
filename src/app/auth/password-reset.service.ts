import { Injectable } from '@angular/core';
import { SquacApiService } from '../squacapi.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private url = 'password_reset/';
  private token: string;
  constructor(
    private http: HttpClient,
    private squacApi: SquacApiService
  ) {

  }

  // send email to squac, it sends token to user
  resetPassword(email: string) {
    return this.squacApi.post(this.url, {
        email
      }
    );
  }

  // check token is valid
  validateToken(token: string) {
    console.log('validating token');
    const path = 'validate_token/';
    this.token = token;
    return this.squacApi.post(this.url + path, {
      token
    });
  }

  // send new password
  confirmPassword(password) {
    const path = 'confirm/';
    console.log('confirm', path);
    return this.squacApi.post(this.url + path, {
      password,
      token: this.token
    });
  }
}

