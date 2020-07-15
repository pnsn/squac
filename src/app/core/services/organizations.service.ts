import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SquacApiService } from './squacapi.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Organization } from '@core/models/organization';
import { map } from 'rxjs/operators';

interface OrganizationHttpData {

}

// Service to get user info & reset things
@Injectable({
providedIn: 'root'
})
export class OrganizationsService {
  private url = 'organization/organizations/';
  private localOrganizations : Organization[];

  constructor(
    private http: HttpClient,
    private squacApi: SquacApiService
  ) { }


  fetchOrganizations() {
    this.squacApi.get(this.url).subscribe(
      response => {
        this.localOrganizations = [];
        for (let organization of response) {
          this.localOrganizations.push(this.mapOrganization(organization));
        }
      },

      error => {
        console.log('error in user service: ' + error);
      }
    );
  }

  getOrganizationById(id : number) {
    this.squacApi.get(this.url, id).subscribe(
      response => {
        return this.mapOrganization(response);
      },

      error => {
        console.log('error in user service: ' + error);
      }
    );
  }

  //returns organization users
  getOrganizationsForUser(id: number) : Observable<any[]> {
    return this.squacApi.get("organization/users/", null, {
      user: id
    }).pipe(
      map(response => {
        return this.mapOrgUsers(response);
      })
    )
  }

  mapOrganization(squacData) {
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

  mapOrgUsers(squacData){
    const users = [];
    for ( let user of squacData) {
      users.push({
        orgUserId: user.id,
        isAdmin: user.is_admin,
        orgId: user.organization,
        email: user.user.email,
        firstname: user.user.firstname,
        lastname: user.user.lastname,
        id: user.user.id
      });
    }
    return users;
  }

}