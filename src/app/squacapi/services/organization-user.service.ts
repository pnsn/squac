import { Injectable } from "@angular/core";
import {
  ApiService,
  OrganizationUsersListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { BaseApiService } from "./generic-api.service";
import { ApiEndpoints } from "@squacapi/interfaces/api.interface";
import { WriteableApiService } from "@squacapi/interfaces/api-service.interface";

import { User } from "@squacapi/models";
import { Observable } from "rxjs";
import { UserAdapter } from "@squacapi/models/user";

@Injectable({
  providedIn: "root",
})
export class OrganizationUserService
  extends BaseApiService<User>
  implements WriteableApiService<User>
{
  constructor(protected adapter: UserAdapter, protected api: ApiService) {
    super(ApiEndpoints.ORGANIZATION_USER, api);
  }

  read(id: number, refresh?: boolean): Observable<User> {
    return super.read(id, { refresh });
  }

  list(
    params: OrganizationUsersListRequestParams,
    refresh?: boolean
  ): Observable<User[]> {
    return super._list(params, { refresh });
  }

  updateOrCreate(t: User): Observable<User> {
    return super._updateOrCreate(t);
  }
}
