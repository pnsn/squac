import { Injectable } from '@angular/core';
import { SquacApiService } from '../squacapi.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private url = '/password_reset';
  private token : string;
  constructor(
    private http: HttpClient,
    private squacApi: SquacApiService
  ) {

  }

  //send email to squac, it sends token to user
  resetPassword(email : string) {
    return of(email);
  }

  // check token is valid
  validateToken(token : string) {
    this.token = token;
    return of(token);
  }

  // send new password
  confirmPassword(password) {
    return of(password, this.token);
  }


}

