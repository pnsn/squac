import { Injectable } from "@angular/core";
import {
  ApiService,
  UserMePartialUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { ApiEndpoint } from "../enums";
import { User } from "../models";

import { Observable } from "rxjs";
import { BaseWriteableApiService } from "./generic-api.service";
import { PartialUpdateService, ReadService } from "../interfaces";

/**
 * Service for interacting with User Me squacapi endpoints
 */
@Injectable({
  providedIn: "root",
})
export class UserMeService
  extends BaseWriteableApiService<User>
  implements ReadService<User>
{
  constructor(override api: ApiService) {
    super(ApiEndpoint.USER_ME, api);
  }

  /**
   * Request current user
   *
   * @returns observable of current user
   */
  override read(): Observable<User> {
    return super.read(null);
  }

  /**
   * @override
   */
  override _partialUpdateParams(
    u: Partial<User>,
    _keys: string[]
  ): UserMePartialUpdateRequestParams {
    const params: UserMePartialUpdateRequestParams = {
      data: {
        firstname: u.firstname,
        lastname: u.lastname,
      },
    };
    return params;
  }
}

export interface UserMeService
  extends ReadService<User>,
    PartialUpdateService<User> {
  read(): Observable<User>;
  partialUpdate(
    t: Partial<User>,
    keys: string[],
    mapId: boolean
  ): Observable<User>;
}
