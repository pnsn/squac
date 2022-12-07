import { Injectable } from "@angular/core";
import {
  ApiService,
  PasswordResetConfirmCreateRequestParams,
  PasswordResetCreateRequestParams,
  PasswordResetValidateTokenCreateRequestParams,
  ReadOnlyEmailSerializer,
  ReadOnlyPasswordTokenSerializer,
  ReadOnlyTokenSerializer,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class PasswordResetService {
  private token = "";
  constructor(private apiService: ApiService) {}

  // send email to squac, it sends token to user
  /**
   *
   * @param email
   */
  resetPassword(email: string): Observable<ReadOnlyEmailSerializer> {
    const params: PasswordResetCreateRequestParams = {
      data: { email },
    };
    return this.apiService.passwordResetCreate(params);
  }

  // check token is valid
  /**
   *
   * @param token
   */
  validateToken(token: string): Observable<ReadOnlyTokenSerializer> {
    this.token = token;
    const params: PasswordResetValidateTokenCreateRequestParams = {
      data: { token },
    };
    return this.apiService.passwordResetValidateTokenCreate(params);
  }

  // send new password
  /**
   *
   * @param password
   */
  confirmPassword(
    password: string
  ): Observable<ReadOnlyPasswordTokenSerializer> {
    const params: PasswordResetConfirmCreateRequestParams = {
      data: {
        password,
        token: this.token,
      },
    };
    return this.apiService.passwordResetConfirmCreate(params);
  }
}
