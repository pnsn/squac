import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SquacApiService } from './squacapi.service';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { Organization } from '@core/models/organization';
import { map } from 'rxjs/operators';
import { User } from '@core/models/user';
import { UserService } from './user.service'; 

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
          console.log(organization)
          this.localOrganizations.push(this.mapOrganization(organization));
          this.organizations.next(this.localOrganizations);
        }
      },

      error => {
        console.log('error in user service: ' + error);
      }
    );
  }

  addUserToOrganization(user : User) : Observable<User> {
    const url = "organization/users/";
    const postData = {
      email: user.email,
      password: "pwthatgetsignored",
      firstname:user.firstname,
      lastname:user.lastname,
      organization: user.orgId,
      is_org_admin : user.isAdmin
    } 
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

  getOrganizationById(id : number) : Observable<Organization>{
   const org = this.localOrganizations.find(
      org => org.id === id
    );
    
    if (org) {
      return of(org);
    } else {
      return this.squacApi.get(this.url, id).pipe(
        map(response => {
          return this.mapOrganization(response);
        }
      ));
    }
  }
  private mapOrganization(squacData) : Organization{
    const users = [];
    for ( let user of squacData.users) {
      users.push(this.mapOrgUsers(user));
    }
    this.mapOrgUsers(squacData.users);
    const newOrg = new Organization(
      squacData.id,
      squacData.name,
      squacData.description,
      users
    );
    return newOrg;
  }

  private mapOrgUsers(user) : User{
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
    return newUser;
  }

}