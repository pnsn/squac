import { Injectable } from "@angular/core";
import { SquacApiService } from "@core/services/squacapi.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PasswordResetService {
  private url = "password_reset/";
  private token: string;
  constructor(private squacApi: SquacApiService) {}

  // send email to squac, it sends token to user
  resetPassword(email: string): Observable<any> {
    return this.squacApi.post(this.url, {
      email,
    });
  }

  // check token is valid
  validateToken(token: string): Observable<any> {
    const path = "validate_token/";
    this.token = token;
    return this.squacApi.post(this.url + path, {
      token,
    });
  }

  // send new password
  confirmPassword(password: string): Observable<any> {
    const path = "confirm/";
    return this.squacApi.post(this.url + path, {
      password,
      token: this.token,
    });
  }
}
