import { Injectable, ViewRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SquacApiService } from '@core/services/squacapi.service';
import { BehaviorSubject, Observable, of, ReplaySubject, forkJoin } from 'rxjs';
import { Organization } from '@core/models/organization';
import { map, switchMap } from 'rxjs/operators';
import { User } from '@core/models/user';
import { UserService } from './user.service';
import { groupRowsByParents } from '@swimlane/ngx-datatable';

// Service to get user info & reset things
@Injectable({
providedIn: 'root'
})
export class OrganizationsService {
  private url = 'organization/organizations/';
  private localOrganizations: Organization[] = [];
  organizations: ReplaySubject<Organization[]> = new ReplaySubject();

  constructor(
    private http: HttpClient,
    private squacApi: SquacApiService
  ) { }

  getOrganizations() {
    return this.localOrganizations.slice();
  }

  fetchOrganizations() {
    this.squacApi.get(this.url).subscribe(
      response => {
        this.localOrganizations = [];
        for (const organization of response) {
          // FIXME: won't have user information
          this.localOrganizations.push(this.mapOrganization(organization));
          this.organizations.next(this.localOrganizations);
        }
      },

      error => {
        console.log('error in user service: ' + error);
      }
    );
  }

  updateUser(user: {email: string, isAdmin: boolean, orgId: number, groups: string[], id?: number}): Observable<User> {
    const url = 'organization/users/';
    const postData = {
      email: user.email,
      password: 'pwthatgetsignored',
      firstname: 'firstName',
      lastname: 'lastName',
      groups: user.groups,
      organization: user.orgId,
      is_org_admin : user.isAdmin
    };
    if (user.id) {
      return this.squacApi.put(url, user.id, postData).pipe(
        map((data) => this.mapOrgUsers(data))
      );
    } else {
      return this.squacApi.post(url, postData).pipe(
          map((data) => this.mapOrgUsers(data))

        );
    }

  }

  getOrganizationById(id: number): Observable<Organization> {
  //  const org = this.localOrganizations.find(
  //     org => org.id === id
  //   );

    // if (org) {
    //   return of(org);
    // } else {

      return forkJoin(
        {
          users: this.getOrganizationUsers(id),
          organization: this.squacApi.get(this.url, id)
        }
      ).pipe( map(
          response => {
            return this.mapOrganization(response.organization, response.users);
          }
        )
      );
    // }
  }

  getOrganizationUsers(orgId): Observable<User[]> {
    const url = 'organization/users/';
    return this.squacApi.get(url, null, {
        organization: orgId
      }).pipe(map(response => {
        const users = [];
        for (const user of response) {
          users.push(this.mapOrgUsers(user));
        }
        return users;
      }
    ));
  }

  private mapOrganization(squacData, users?): Organization {
    const newOrg = new Organization(
      squacData.id,
      squacData.name,
      squacData.description,
      users ? users : []
    );
    return newOrg;
  }

  // 1: viewer
  // 2: reporter
  // 3: contributor
  private mapOrgUsers(user): User {
    const newUser = new User(
      user.id,
      user.email,
      user.firstname,
      user.lastname,
      user.organization,
      user.is_org_admin,
      user.groups
    );
    newUser.isActive = user.is_active;
    newUser.lastLogin = user.last_login;
    return newUser;
  }

}
