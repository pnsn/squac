import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SquacApiService } from './squacapi.service';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { Organization } from '@core/models/organization';
import { map } from 'rxjs/operators';
import { User } from '@core/models/user';
import { UserService } from './user.service';

interface OrganizationHttpData {

}

// Service to get user info & reset things
@Injectable({
providedIn: 'root'
})
export class OrganizationsService {
  private url = 'organization/organizations/';
  private localOrganizations : Organization[] = [];
  organizations : ReplaySubject<Organization[]> = new ReplaySubject();

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
        for (let organization of response) {
          this.localOrganizations.push(this.mapOrganization(organization));
          this.organizations.next(this.localOrganizations);
        }
      },

      error => {
        console.log('error in user service: ' + error);
      }
    );
  }

  getOrganizationById(id : number) {
   return this.localOrganizations.find(
      org => org.id === id
    );
    
    // if (org) {
    //   return of(org);
    // } else {
    //   return this.squacApi.get(this.url, id);
    // }
  }
  private mapOrganization(squacData) : Organization{
    const users = this.mapOrgUsers(squacData.organization_users);
    const newOrg = new Organization(
      squacData.id,
      squacData.name,
      squacData.description,
      users
    );
    return newOrg;
  }

  private mapOrgUsers(squacData) : User[]{
    const users = [];
    for ( let user of squacData) {
      const newUser = new User(
        user.id,
        user.email,
        user.firstname,
        user.lastname,
        user.organization,
        user.is_org_admin
      )

      newUser.isActive = user.is_active;
      newUser.lastLogin = user.last_login;
      users.push(newUser);
    }
    console.log(users)
    return users;
  }

}