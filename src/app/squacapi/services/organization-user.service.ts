import { Injectable } from "@angular/core";
import {
  ApiService,
  OrganizationUsersListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { BaseApiService } from "./generic-api.service";
import { ApiEndpoints } from "@squacapi/interfaces/api.interface";
import { WriteableApiService } from "@squacapi/interfaces/api-service.interface";

import { User, UserAdapter } from "@squacapi/models/user";
import { Observable } from "rxjs";

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

  read(id: number): Observable<User> {
    return super.read(id);
  }

  list(params: OrganizationUsersListRequestParams): Observable<User[]> {
    return super._list(params);
  }

  updateOrCreate(t: User): Observable<User> {
    return super._updateOrCreate(t);
  }
}
