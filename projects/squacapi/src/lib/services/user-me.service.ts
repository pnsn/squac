import { Injectable } from "@angular/core";
import {
  ApiService,
  UserMePartialUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { ApiEndpoint } from "../enums";
import { User, UserAdapter } from "../models";

import { map, Observable } from "rxjs";
import { BaseApiService } from "./generic-api.service";
import { PartialUpdateService, ReadService } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class UserMeService
  extends BaseApiService<User>
  implements ReadService<User>, PartialUpdateService<User>
{
  constructor(override adapter: UserAdapter, override api: ApiService) {
    super(ApiEndpoint.USER_ME, api);
  }

  override read(): Observable<User> {
    return super._read();
  }

  partialUpdate(t: Partial<User>): Observable<User> {
    const params: UserMePartialUpdateRequestParams = {
      data: {
        organization: t.orgId ?? 0,
        firstname: t.firstName,
        lastname: t.lastName,
      },
    };
    return this.api[`${this.apiEndpoint}PartialUpdate`](
      params,
      this.observe,
      this.reportProgress
    ).pipe(map(this.adapter.adaptFromApi.bind(this)));
  }
}