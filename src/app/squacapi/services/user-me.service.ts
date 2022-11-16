import { Injectable } from "@angular/core";
import {
  ApiService,
  UserMePartialUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { ApiEndpoints } from "@squacapi/interfaces/api.interface";
import { User } from "@squacapi/models";

import { Observable } from "rxjs";
import { BaseApiService } from "./generic-api.service";
import { ReadUpdateApiService } from "@squacapi/interfaces/api-service.interface";
import { UserAdapter } from "@squacapi/models/user";

@Injectable({
  providedIn: "root",
})
export class UserMeService
  extends BaseApiService<User>
  implements ReadUpdateApiService<User>
{
  constructor(protected adapter: UserAdapter, protected api: ApiService) {
    super(ApiEndpoints.USER_ME, api);
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
