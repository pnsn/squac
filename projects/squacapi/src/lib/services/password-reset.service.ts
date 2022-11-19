import { Injectable } from "@angular/core";
import {
  ApiService,
  PasswordResetConfirmCreateRequestParams,
  PasswordResetCreateRequestParams,
  PasswordResetValidateTokenCreateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PasswordResetService {
  private token = "";
  constructor(private apiService: ApiService) {}

  // send email to squac, it sends token to user
  resetPassword(email: string): Observable<any> {
    const params: PasswordResetCreateRequestParams = {
      data: { email },
    };
    return this.apiService.passwordResetCreate(params);
  }

  // check token is valid
  validateToken(token: string): Observable<any> {
    this.token = token;
    const params: PasswordResetValidateTokenCreateRequestParams = {
      data: { token },
    };
    return this.apiService.passwordResetValidateTokenCreate(params);
  }

  // send new password
  confirmPassword(password: string): Observable<any> {
    const params: PasswordResetConfirmCreateRequestParams = {
      data: {
        password,
        token: this.token,
      },
    };
    return this.apiService.passwordResetConfirmCreate(params);
  }
}
