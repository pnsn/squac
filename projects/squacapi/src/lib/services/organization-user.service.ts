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
export class OrganizationUserService extends BaseApiService<User> {
  constructor(override adapter: UserAdapter, override api: ApiService) {
    super(ApiEndpoint.ORGANIZATION_USER, api);
  }
}

export interface OrganizationUserService extends WriteableApiService<User> {
  read(id: number, refresh?: boolean): Observable<User>;
  list(
    params: OrganizationUsersListRequestParams,
    refresh?: boolean
  ): Observable<User[]>;
  updateOrCreate(t: User): Observable<User>;
}
