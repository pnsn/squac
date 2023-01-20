import { Injectable } from "@angular/core";
import {
  ApiService,
  UserMePartialUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { ApiEndpoint } from "../enums";
import { User } from "../models";

import { map, Observable } from "rxjs";
import { BaseWriteableApiService } from "./generic-api.service";
import { PartialUpdateService, ReadService, WriteUser } from "../interfaces";

/**
 * Service for interacting with User Me squacapi endpoints
 */
@Injectable({
  providedIn: "root",
})
export class UserMeService
  extends BaseWriteableApiService<User>
  implements ReadService<User>, PartialUpdateService<User>
{
  constructor(override api: ApiService) {
    super(ApiEndpoint.USER_ME, api);
  }

  deserialize = User.deserialize;

  serialize(model: User): WriteUser {
    return model.serialize();
  }
  /**
   * Request current user
   *
   * @returns observable of current user
   */
  override read(): Observable<User> {
    return super._read();
  }

  /**
   * Sends user information to squacapi for partial update
   *
   * @param t - user information to update
   * @returns updated user information
   */
  partialUpdate(t: Partial<User>): Observable<User> {
    const params: UserMePartialUpdateRequestParams = {
      data: {
        firstname: t.firstName,
        lastname: t.lastName,
      },
    };
    return this.api[`${this.apiEndpoint}PartialUpdate`](
      params,
      this.observe,
      this.reportProgress
    ).pipe(map(User.deserialize));
  }
}
