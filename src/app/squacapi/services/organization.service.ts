import { Injectable } from "@angular/core";
import {
  ApiService,
  OrganizationOrganizationsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { ApiEndpoint } from "../enums";
import { ReadOnlyApiService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import { Organization, OrganizationAdapter } from "../models";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrganizationService
  extends BaseApiService<Organization>
  implements ReadOnlyApiService<Organization>
{
  private localOrganizations: Organization[] = [];
  private orgUsers = {};
  constructor(
    protected adapter: OrganizationAdapter,
    protected api: ApiService
  ) {
    super(ApiEndpoint.ORGANIZATION, api);
  }

  read(id: number, refresh?: boolean): Observable<Organization> {
    return super.read(id, { refresh });
  }

  list(
    params?: OrganizationOrganizationsListRequestParams,
    refresh?: boolean
  ): Observable<Organization[]> {
    return super._list(params, { refresh }).pipe(
      tap((organizations: Organization[]) => {
        this.localOrganizations = organizations.slice();
        organizations.forEach((org) => {
          for (const user of org.users) {
            this.orgUsers[user.id] = {
              first: user.firstName,
              last: user.lastName,
            };
          }
        });
      })
    );
  }

  getOrgUserName(id): string {
    const orgUser = this.orgUsers[id];
    return orgUser ? orgUser.first + " " + orgUser.last : "unknown";
  }

  getOrgName(id): string {
    const org = this.localOrganizations.find((o) => o.id === id);
    return org ? org.name : "unknown";
  }
}
