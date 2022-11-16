import { Injectable } from "@angular/core";
import {
  ApiService,
  UserMePartialUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { ApiEndpoint } from "../enums";
import { User, UserAdapter } from "../models";

import { Observable } from "rxjs";
import { BaseApiService } from "./generic-api.service";
import { ReadUpdateApiService } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class UserMeService
  extends BaseApiService<User>
  implements ReadUpdateApiService<User>
{
  constructor(protected adapter: UserAdapter, protected api: ApiService) {
    super(ApiEndpoint.USER_ME, api);
  }

  read(): Observable<User> {
    return super._read();
  }

  update(t: Partial<User>): Observable<User> {
    const params: UserMePartialUpdateRequestParams = {
      data: {
        organization: t.orgId,
        firstname: t.firstName,
        lastname: t.lastName,
      },
    };
    return super._update(params);
  }
}
