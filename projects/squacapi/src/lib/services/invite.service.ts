import { Injectable } from "@angular/core";
import {
  InviteCreateRequestParams,
  InviteService as InviteApi,
  RegisterCreateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

// Service to get user info & reset things
@Injectable({
  providedIn: "root",
})
export class InviteService {
  constructor(private inviteApi: InviteApi) {}

  // tells squac to send an invite to existing user
  sendInviteToUser(user: number): Observable<object> {
    const params: InviteCreateRequestParams = {
      data: {
        user,
      },
    };
    return this.inviteApi.inviteCreate(params);
  }

  // sends registration info to squac
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
