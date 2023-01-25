import { WriteOnlyUserSerializer } from "@pnsn/ngx-squacapi-client";
import { ReadUser, ResourceModel, WriteUser } from "../interfaces";

/**
 * Describes a user object
 */
export class User extends ResourceModel<ReadUser, WriteUser> {
  email: string;
  firstName: string;
  lastName: string;
  orgId: number;
  orgAdmin: boolean;
  groups: Set<string>;
  lastLogin: string;
  squacAdmin: boolean;
  isActive: boolean;

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

  fromRaw(data: ReadUser): void {
    Object.assign(this, data);

    this.firstName = data.firstname;
    this.lastName = data.lastname;
    this.orgId = data.organization;
    this.orgAdmin = data.is_org_admin;
    this.groups = new Set<string>(data.groups);

    if ("last_login" in data) {
      this.lastLogin = data.last_login;
    }

    if ("is_staff" in data) {
      this.squacAdmin = data.is_staff;
    }

    if ("is_active" in data) {
      this.isActive = data.is_active;
    }
  }

  toJson(): WriteOnlyUserSerializer {
    return {
      email: this.email,
      firstname: this.firstName,
      lastname: this.lastName,
      organization: this.orgId,
      is_org_admin: this.orgAdmin,
      is_active: this.isActive,
      groups: this.groups,
    };
  }

  /**
   * Checks if user is in the given group
   *
   * @param group group to test
   * @returns true if user is in the group
   */
  inGroup(group: string): boolean {
    return this.groups.has(group);
  }
}
