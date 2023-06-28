import { Injectable } from "@angular/core";
import {
  ApiService,
  OrganizationOrganizationsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { ApiEndpoint } from "../enums";
import { ReadOnlyApiService } from "../interfaces";
import { BaseReadOnlyApiService } from "./generic-api.service";
import { Organization } from "../models";
import { Observable, tap } from "rxjs";

/**
 * Service for requesting organization data from squacapi
 */
@Injectable({
  providedIn: "root",
})
export class OrganizationService extends BaseReadOnlyApiService<Organization> {
  private localOrganizations: Organization[] = [];
  private orgUsers: Record<number, { first: string; last: string }> = {};
  constructor(override api: ApiService) {
    super(ApiEndpoint.ORGANIZATION, api);
  }

  /**
   * @override
   */
  override list(
    params?: OrganizationOrganizationsListRequestParams,
    refresh?: boolean
  ): Observable<Organization[]> {
    return super.list(params, refresh).pipe(
      tap((organizations: Organization[]) => {
        if (organizations) {
          console.log(organizations);
          this.localOrganizations = organizations.slice();
          organizations.forEach((org) => {
            for (const user of org.users) {
              this.orgUsers[user.id] = {
                first: user.firstname,
                last: user.lastname,
              };
            }
          });
        }
      })
    );
  }

  /**
   * Returns name of a user in an organization with the given id
   *
   * @param id user id
   * @returns user's name if found
   */
  getOrgUserName(id: number): string {
    const orgUser = this.orgUsers[id];
    return orgUser ? orgUser.first + " " + orgUser.last : "unknown";
  }

  /**
   * Returns name of an organization with the given id
   *
   * @param id organization id
   * @returns organization name
   */
  getOrgName(id: number): string {
    const org = this.localOrganizations.find((o) => o.id === id);
    return org ? org.name : "unknown";
  }
}

export interface OrganizationService extends ReadOnlyApiService<Organization> {
  read(id: number, refresh?: boolean): Observable<Organization>;
  list(
    params?: OrganizationOrganizationsListRequestParams,
    refresh?: boolean
  ): Observable<Organization[]>;
}
