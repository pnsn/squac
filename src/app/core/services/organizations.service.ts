import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SquacApiService } from './squacapi.service';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { Organization } from '@core/models/organization';
import { map } from 'rxjs/operators';
import { OrganizationUser } from '@core/models/organization-user';
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

  //returns organization users
  getOrganizationsForUser(id: number) : Observable<OrganizationUser[]> {
    return this.squacApi.get("organization/users/", null, {
      user: id
    }).pipe(
      map(response => {
        return this.mapOrgUsers(response);
      })
    )
  }

  private mapOrganization(squacData) : Organization{
    const users = this.mapOrgUsers(squacData.organization_users);
    const newOrg = new Organization(
      squacData.id,
      squacData.name,
      users, 
      squacData.slug,
      squacData.is_active
    );
    return newOrg;
  }

  private mapOrgUsers(squacData) : OrganizationUser[]{
    const users = [];
    for ( let user of squacData) {
      const newUser = new OrganizationUser(
        user.id,
        user.is_admin,
        user.organization,
        user.user.email,
        user.user.firstname,
        user.user.lastname,
        user.user.id
      )
      
      users.push(newUser);
    }
    console.log(users)
    return users;
  }

}