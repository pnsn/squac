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
  email: string,
  password?: string,
  firstname: string,
  lastname: string,
  groups: Array<number>,
  organization: number,
  is_org_admin: boolean
}

@Injectable({
  providedIn: 'root',
})
export class UserAdapter implements Adapter<User> {
  // Temp until Jon fixes
  private groupIds = [
    {id: 1, name: 'viewer'},
    {id: 2, name: 'reporter'},
    {id: 3, name: 'contributor'},
    {id: 4, name: 'admin'}
  ];

  adaptFromApi(item: ApiGetUser): User {
    let groups = [];
    if(item.groups) {
      groups = item.groups.map(
        g => {
          if(typeof g === "number") {
            const group = this.groupIds.find(groupId => groupId.id === g);
            if (group) {
              return group.name;
            } else {
              return;
            }
          } else {
            return g;
          }
        }
      );
    }

    const user = new User(
      item.id,
      item.email,
      item.firstname,
      item.lastname,
      item.organization,
      item.is_org_admin,
      groups
    );
    user.lastLogin = item.last_login;
    user.squacAdmin = item.is_staff;
    user.isActive = item.is_active;
    return user;
  }

  adaptToApi(item: User) : ApiPostUser {
    const groups = item.groups.map(
      g => {
        const group = this.groupIds.find(groupId => groupId.name === g);
        if (group) {
          return group.id;
        } else {
          return;
        }
      }
    );

  return {
    email: item.email,
    firstname: item.firstName,
    lastname: item.lastName,
    organization: item.orgId,
    is_org_admin: item.orgAdmin,
    groups: groups
  }
  }
}