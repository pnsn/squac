import { Injectable } from "@angular/core";
import { UserGroup } from "@pnsn/ngx-squacapi-client";
import { Adapter, ReadUser, WriteUser } from "../interfaces";

// Describes a user object
export class User {
  constructor(
    public id: number,
    public email: string,
    public firstName: string,
    public lastName: string,
    public orgId: number,
    public orgAdmin: boolean,
    groupsArr?: (string | UserGroup)[]
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

  static get modelName(): string {
    return "User";
  }
}

@Injectable({
  providedIn: "root",
})
export class UserAdapter implements Adapter<User, ReadUser, WriteUser> {
  // Temp until Jon fixes
  private groupIds = [
    { id: 1, name: "viewer" },
    { id: 2, name: "reporter" },
    { id: 3, name: "contributor" },
    { id: 4, name: "admin" },
  ];

  adaptFromApi(item: ReadUser): User {
    const groups = [];
    if ("groups" in item) {
      item.groups.forEach((g) => {
        let group = g;
        if (typeof g === "number") {
          group = this.groupIds.find((groupId) => groupId.id === g);
        }
        groups.push(group.name);
      });
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
    if ("last_login" in item) {
      user.lastLogin = item.last_login;
    }

    if ("is_staff" in item) {
      user.squacAdmin = item.is_staff;
    }

    if ("is_active" in item) {
      user.isActive = item.is_active;
    }

    return user;
  }

  adaptToApi(item: User): WriteUser {
    const groups = item.groups.map((g) => {
      const group = this.groupIds.find((groupId) => groupId.name === g);
      return group.id;
    });
    return {
      email: item.email,
      firstname: item.firstName,
      lastname: item.lastName,
      organization: item.orgId,
      is_org_admin: item.orgAdmin,
      is_active: item.isActive,
      groups,
    };
  }
}
