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
 * Service for passsword reset endpoints
 */
@Injectable({
  providedIn: "root",
})
export class PasswordResetService {
  private token = "";
  constructor(private apiService: ApiService) {}

  /**
   * Resets password for given email
   *
   * @param email user email
   * @returns observable of request
   */
  resetPassword(email: string): Observable<ReadOnlyEmailSerializer> {
    const params: PasswordResetCreateRequestParams = {
      data: { email },
    };
    return this.apiService.passwordResetCreate(params);
  }

  /**
   * Verify if password reset token is valid
   *
   * @param token password token
   * @returns observable of token response
   */
  validateToken(token: string): Observable<ReadOnlyTokenSerializer> {
    this.token = token;
    const params: PasswordResetValidateTokenCreateRequestParams = {
      data: { token },
    };
    return this.apiService.passwordResetValidateTokenCreate(params);
  }

  /**
   * Updates user account with new password
   *
   * @param password new password to store
   * @returns response of password update request
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
