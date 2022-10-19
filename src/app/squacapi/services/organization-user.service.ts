import { Injectable } from "@angular/core";
import {
  ApiService,
  OrganizationUsersListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import {
  BaseApiService,
  WriteableApiService,
} from "@squacapi/interfaces/generic-api-service";

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
    super("organizationUser", api);
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
