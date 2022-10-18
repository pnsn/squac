import { Injectable } from "@angular/core";
import {
  ApiService,
  OrganizationOrganizationsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import {
  ListApiService,
  ListOnlyApiService,
  SquacApiService,
} from "@squacapi/interfaces/generic-api-service";
import {
  Organization,
  OrganizationAdapter,
} from "@squacapi/models/organization";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrganizationService extends ListApiService<Organization> {
  private localOrganizations: Organization[] = [];
  private orgUsers = {};
  constructor(
    protected adapter: OrganizationAdapter,
    protected api: ApiService
  ) {
    super("organizationOrganizations", api);
  }

  listParams(params: any): OrganizationOrganizationsListRequestParams {
    return params;
  }

  list(params?: any): Observable<Organization[]> {
    return super.list(params).pipe(
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
