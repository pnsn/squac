import { Injectable } from "@angular/core";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { ReadWriteDeleteApiService } from "@squacapi/interfaces/generic-api-service";
import { Organization } from "@squacapi/models/organization";
import { User, UserAdapter } from "@squacapi/models/user";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrganizationUserService extends ReadWriteDeleteApiService<User> {
  constructor(protected adapter: UserAdapter, protected api: ApiService) {
    super("organizationUser", api);
  }
}
