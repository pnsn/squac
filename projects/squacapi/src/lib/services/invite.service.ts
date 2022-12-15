import { Injectable } from "@angular/core";
import {
  InviteCreateRequestParams,
  InviteService as InviteApi,
  RegisterCreateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

/**
 * Service for interacting with invite endpoints
 */
@Injectable({
  providedIn: "root",
})
export class InviteService {
  constructor(private inviteApi: InviteApi) {}

  /**
   * Send invite to existing user
   *
   * @param user id of user to invite
   * @returns Request observable
   */
  sendInviteToUser(user: number): Observable<object> {
    const params: InviteCreateRequestParams = {
      data: {
        user,
      },
    };
    return this.inviteApi.inviteCreate(params);
  }

  /**
   * Send user registration information to SQUAC
   *
   * @param firstname user first name
   * @param lastname user last name
   * @param token token
   * @param password new password
   * @returns create request observable
   */
  registerUser(
    firstname: string,
    lastname: string,
    token: string,
    password: string
  ): Observable<object> {
    const params: RegisterCreateRequestParams = {
      data: {
        firstname,
        lastname,
        token,
        password,
      },
    };

    return this.inviteApi.registerCreate(params);
  }
}
