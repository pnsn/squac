import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";

// Describes a user object
export class User {

  constructor(
    public id: number,
    public email: string,
    public firstName: string,
    public lastName: string,
    public orgId: number,
    public orgAdmin: boolean,
    groupsArr?: any
  ) {

    this.groups = [];
    if (groupsArr) {
      for (const group of groupsArr) {
        if (group instanceof Object) {
          this.groups.push(group.name);
        } else {
          this.groups.push(group.toString());
        }
      }
    }
  }
  lastLogin: string;
  squacAdmin: boolean;
  isActive: boolean;
  groups: string[];

  get isStaff(): boolean {
    return this.squacAdmin ? this.squacAdmin : false;
  }

  get isAdmin(): boolean {
    return this.orgAdmin; // or is an admin of the current group?
  }

  inGroup(group: string): boolean {
    return this.groups ? this.groups.indexOf(group) >= 0 : false;
  }
}

export interface ApiGetUser {
  email?: string;
  firstname?: string;
  lastname?: string;
  is_staff: boolean;
  groups?: Array<number|string>;
  id: number;
  organization?:number;
  is_org_admin: boolean;
  last_login: string;
  is_active: boolean;
}

export interface ApiPostUser {
  
}

@Injectable({
  providedIn: 'root',
})
export class UserAdapter implements Adapter<User> {
  adaptFromApi(item: ApiGetUser): User {
    const user = new User(
      item.id,
      item.email,
      item.firstname,
      item.lastname,
      item.organization,
      item.is_org_admin,
      item.groups
    );
    user.lastLogin = item.last_login;
    user.squacAdmin = item.is_staff;
    user.isActive = item.is_active;
    return user;
  }

  adaptToApi(){}
}