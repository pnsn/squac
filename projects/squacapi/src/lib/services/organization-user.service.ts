import { Injectable } from "@angular/core";
import {
  ApiService,
  OrganizationUsersListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { BaseApiService } from "./generic-api.service";
import { ApiEndpoint } from "../enums";
import { WriteableApiService } from "../interfaces";

import { User, UserAdapter } from "../models";
import { Observable } from "rxjs";

/**
 * Service for managing organization users
 */
@Injectable({
  providedIn: "root",
})
export class OrganizationUserService
  extends BaseApiService<User>
  implements WriteableApiService<User>
{
  constructor(override adapter: UserAdapter, override api: ApiService) {
    super(ApiEndpoint.ORGANIZATION_USER, api);
  }

  /**
   * @override
   */
  override read(id: number, refresh?: boolean): Observable<User> {
    return super.read(id, refresh);
  }

  /**
   * @override
   */
  list(
    params: OrganizationUsersListRequestParams,
    refresh?: boolean
  ): Observable<User[]> {
    return super._list(params, { refresh });
  }

  /**
   * @override
   */
  updateOrCreate(t: User): Observable<User> {
    return super._updateOrCreate(t);
  }
}
