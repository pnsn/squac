import { Injectable } from "@angular/core";
import {
  ApiService,
  OrganizationOrganizationsListRequestParams,
  OrganizationUsersCreateRequestParams,
  OrganizationUsersPartialUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import {
  Organization,
  OrganizationAdapter,
} from "@squacapi/models/organization";
import { User, UserAdapter } from "@squacapi/models/user";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

// Service to get user info & reset things
@Injectable({
  providedIn: "root",
})
export class OrganizationService {
  private localOrganizations: Organization[] = [];
  private orgUsers = {};
  constructor(
    protected api: ApiService,
    private organizationAdapter: OrganizationAdapter,
    private userAdapter: UserAdapter
  ) {}

  get organizations() {
    return this.localOrganizations.slice();
  }

  // getOrganizations(): Observable<Organization[]> {
  //   const params: OrganizationOrganizationsListRequestParams = {};
  //   return this.api.organizationOrganizationsList(params).pipe(
  //     map((response) =>
  //       response.map((r) => {
  //         this.storeOrgUsers(r.users);
  //         return this.organizationAdapter.adaptFromApi(r);
  //       })
  //     ),
  //     tap((organizations) => {
  //       this.localOrganizations = organizations.slice();
  //     })
  //   );
  // }

  // updateUser(user: User): Observable<User> {
  //   const postData = this.userAdapter.adaptToApi(user);
  //   if (user.id) {
  //     const params: OrganizationUsersPartialUpdateRequestParams = {
  //       id: user.id.toString(),
  //       data: postData,
  //     };
  //     return this.api
  //       .organizationUsersPartialUpdate(params)
  //       .pipe(map((response) => this.userAdapter.adaptFromApi(response)));
  //   } else {
  //     const params: OrganizationUsersCreateRequestParams = {
  //       data: postData,
  //     };
  //     return this.api
  //       .organizationUsersCreate(params)
  //       .pipe(map((response) => this.userAdapter.adaptFromApi(response)));
  //   }
  // }

  // getOrganization(id: number): Observable<Organization> {
  //   return this.api
  //     .organizationOrganizationsRead({ id: id.toString() })
  //     .pipe(map((response) => this.organizationAdapter.adaptFromApi(response)));
  // }

  // getOrganizationUsers(orgId: number): Observable<User[]> {
  //   return this.api
  //     .organizationUsersList({
  //       organization: orgId.toString(),
  //     })
  //     .pipe(
  //       map((response) => response.map((r) => this.userAdapter.adaptFromApi(r)))
  //     );
  // }

  // deleteUser(userId): Observable<User> {
  //   return this.api.organizationUsersDelete({
  //     id: userId.toString(),
  //   });
  // }

  private storeOrgUsers(orgUsers): void {
    for (const user of orgUsers) {
      this.orgUsers[user.id] = {
        first: user.firstname,
        last: user.lastname,
      };
    }
  }
}
