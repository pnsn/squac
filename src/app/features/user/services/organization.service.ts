import { Injectable } from "@angular/core";
import { SquacApiService } from "@core/services/squacapi.service";
import { Observable } from "rxjs";
import { Organization, OrganizationAdapter } from "@user/models/organization";
import { map, tap } from "rxjs/operators";
import { User, UserAdapter } from "@user/models/user";

// Service to get user info & reset things
@Injectable({
  providedIn: "root",
})
export class OrganizationService {
  private url = "organization/";
  private localOrganizations: Organization[] = [];
  private orgUsers = {};
  constructor(
    private squacApi: SquacApiService,
    private organizationAdapter: OrganizationAdapter,
    private userAdapter: UserAdapter
  ) {}

  get organizations() {
    return this.localOrganizations.slice();
  }

  getOrgName(id): string {
    const org = this.localOrganizations.find((o) => o.id === id);
    return org ? org.name : "unknown";
  }

  getOrgUserName(id): string {
    const orgUser = this.orgUsers[id];
    return orgUser ? orgUser.first + " " + orgUser.last : "unknown";
  }

  getOrganizations(): Observable<Organization[]> {
    const path = "organizations/";
    return this.squacApi.get(this.url + path).pipe(
      map((response) =>
        response.map((r) => {
          this.storeOrgUsers(r.users);
          return this.organizationAdapter.adaptFromApi(r);
        })
      ),
      tap((organizations) => {
        this.localOrganizations = organizations.slice();
      })
    );
  }

  updateUser(user: User): Observable<User> {
    const path = "users/";
    const postData = this.userAdapter.adaptToApi(user);
    console.log(postData);
    if (user.id) {
      return this.squacApi
        .patch(this.url + path, user.id, postData)
        .pipe(map((response) => this.userAdapter.adaptFromApi(response)));
    } else {
      return this.squacApi
        .post(this.url + path, postData)
        .pipe(map((response) => this.userAdapter.adaptFromApi(response)));
    }
  }

  getOrganization(id: number): Observable<Organization> {
    const path = "organizations/";
    return this.squacApi
      .get(this.url + path, id)
      .pipe(map((response) => this.organizationAdapter.adaptFromApi(response)));
  }

  getOrganizationUsers(orgId: number): Observable<User[]> {
    const path = "users/";
    return this.squacApi
      .get(this.url + path, null, {
        organization: orgId,
      })
      .pipe(
        map((response) => response.map((r) => this.userAdapter.adaptFromApi(r)))
      );
  }

  deleteUser(userId): Observable<User> {
    const path = "users/";
    return this.squacApi.delete(this.url + path, userId);
  }

  private storeOrgUsers(orgUsers): void {
    for (const user of orgUsers) {
      this.orgUsers[user.id] = {
        first: user.firstname,
        last: user.lastname,
      };
    }
  }
}
