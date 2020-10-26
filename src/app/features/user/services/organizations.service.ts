import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SquacApiService } from '@core/services/squacapi.service';
import {  Observable, ReplaySubject, forkJoin } from 'rxjs';
import { Organization } from '@features/user/models/organization';
import { map, tap} from 'rxjs/operators';
import { User } from '@features/user/models/user';
import { UserService } from './user.service';

// Service to get user info & reset things
@Injectable({
providedIn: 'root'
})
export class OrganizationsService {
  private url = 'organization/';
  private localOrganizations: Organization[] = [];

  constructor(
    private http: HttpClient,
    private squacApi: SquacApiService,
    private userService: UserService
  ) { }

  // Temp until Jon fixes
  private groupIds = [
    {id: 1, name: 'viewer'},
    {id: 2, name: 'reporter'},
    {id: 3, name: 'contributor'}
  ];

  get organizations() {
    return this.localOrganizations.slice();
  }

  getOrgName(id): string{
    const org = this.localOrganizations.find(o => o.id === id);
    return org ? org.name : 'unknown';
  }

  getOrganizations(): Observable<Organization[]> {
    const path = 'organizations/';
    return this.squacApi.get(this.url + path).pipe(
      map(
        response => {
          const organizations = [];

          for (const org of response) {
            organizations.push(this.mapOrganization(org));
          }

          return organizations;
        }
      ),
      tap(
        organizations => {
          this.localOrganizations = organizations.slice();
        }
      )
    );
  }

  updateUser(user: {email: string, isAdmin: boolean, orgId: number, groups: string[], id?: number}): Observable<User> {
    const path = 'users/';

    // get the ids
    const groups = [];
    for (const groupName of user.groups) {
      const group = this.groupIds.find(groupId => groupId.name === groupName);
      if (group) {
        groups.push(group.id);
      }
    }

    const postData = {
      email: user.email,
      password: 'pwthatgetsignored',
      firstname: 'firstName',
      lastname: 'lastName',
      groups,
      organization: user.orgId,
      is_org_admin : user.isAdmin
    };
    if (user.id) {
      return this.squacApi.put(this.url + path, user.id, postData).pipe(
        map((data) => this.mapOrgUsers(data))
      );
    } else {
      return this.squacApi.post(this.url + path, postData).pipe(
          map((data) => this.mapOrgUsers(data))

        );
    }

  }

  getOrganization(id: number): Observable<Organization> {
    const path = 'organizations/';
    return forkJoin(
        {
          users: this.getOrganizationUsers(id),
          organization: this.squacApi.get(this.url + path, id)
        }
      ).pipe( map(
          response => {
            return this.mapOrganization(response.organization, response.users);
          }
        )
      );
  }

  getOrganizationUsers(orgId): Observable<User[]> {
    const path = 'users/';
    return this.squacApi.get(this.url + path, null, {
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

  private mapOrgUsers(user): User {
    const groups = [];
    for (const groupID of user.groups) {
      const group = this.groupIds.find(groupId => groupId.id === groupID);
      if (group) {
        groups.push(group.name);
      }
    }
    const newUser = new User(
      user.id,
      user.email,
      user.firstname,
      user.lastname,
      user.organization,
      user.is_org_admin,
      groups
    );
    newUser.isActive = user.is_active;
    newUser.lastLogin = user.last_login;
    return newUser;
  }
}
