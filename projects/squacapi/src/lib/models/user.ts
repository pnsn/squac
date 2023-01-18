import { UserGroup } from "@pnsn/ngx-squacapi-client";
import { ReadUser, WriteUser } from "../interfaces";

/**
 * Describes a user object
 */
export class User {
  static groupIds = [
    { id: 1, name: "viewer" },
    { id: 2, name: "reporter" },
    { id: 3, name: "contributor" },
    { id: 4, name: "admin" },
  ];
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

  /**
   * @returns true if user is staff
   */
  get isStaff(): boolean {
    return this.squacAdmin ? this.squacAdmin : false;
  }

  /**
   * @returns true if user is an org admin
   */
  get isAdmin(): boolean {
    return this.orgAdmin; // or is an admin of the current group?
  }

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "User";
  }

  /**
   *
   * @param item
   */
  static deserialize(item: ReadUser): User {
    const groups = [];
    if ("groups" in item) {
      item.groups.forEach((g) => {
        let group = g;
        if (typeof g === "number") {
          group = User.groupIds.find((groupId) => groupId.id === g);
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

  /**
   * Checks if user is in the given group
   *
   * @param group group to test
   * @returns true if user is in the group
   */
  inGroup(group: string): boolean {
    return this.groups ? this.groups.indexOf(group) >= 0 : false;
  }

  /**
   *
   */
  serialize(): WriteUser {
    const groups = this.groups.map((g) => {
      const group = User.groupIds.find((groupId) => groupId.name === g);
      return group.id;
    });
    return {
      email: this.email,
      firstname: this.firstName,
      lastname: this.lastName,
      organization: this.orgId,
      is_org_admin: this.orgAdmin,
      is_active: this.isActive,
      groups,
    };
  }
}
