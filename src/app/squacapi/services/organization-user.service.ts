import { Injectable } from "@angular/core";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { ReadWriteDeleteApiService } from "@squacapi/interfaces/generic-api-service";
import { User, UserAdapter } from "@squacapi/models/user";

@Injectable({
  providedIn: "root",
})
export class OrganizationUserService extends ReadWriteDeleteApiService<User> {
  constructor(protected adapter: UserAdapter, protected api: ApiService) {
    super("organizationUser", api);
  }
}
