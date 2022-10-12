import { Injectable } from "@angular/core";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PasswordResetService {
  private token: string;
  constructor(private apiService: ApiService) {}

  // send email to squac, it sends token to user
  resetPassword(email: string): Observable<any> {
    return this.apiService.passwordResetCreate({ data: { email } });
  }

  // check token is valid
  validateToken(token: string): Observable<any> {
    this.token = token;
    return this.apiService.passwordResetValidateTokenCreate({
      data: {
        token,
      },
    });
  }

  // send new password
  confirmPassword(password: string): Observable<any> {
    return this.apiService.passwordResetConfirmCreate({
      data: {
        password,
        token: this.token,
      },
    });
  }
}
