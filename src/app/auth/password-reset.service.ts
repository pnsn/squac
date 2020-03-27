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

  // /password_reset
  // to get token

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


}

