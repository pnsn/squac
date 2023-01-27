import {
  WriteOnlyUserSerializer,
  ReadOnlyUserMeSerializer,
  ReadOnlyUserSerializer,
  ReadOnlyUserSimpleSerializer,
  ReadOnlyUserUpdateSerializer,
  UserSimple,
} from "@pnsn/ngx-squacapi-client";
import { ResourceModel } from "../interfaces";

export interface User {
  email: string;
  firstname: string;
  lastname: string;
  orgAdmin: boolean;
  groups: Set<string>;
  lastLogin: string;
  squacAdmin: boolean;
  isActive: boolean;
}
/**
 * Describes a user object
 */
export class User extends ResourceModel<
  | ReadOnlyUserMeSerializer
  | ReadOnlyUserSerializer
  | ReadOnlyUserSimpleSerializer
  | ReadOnlyUserUpdateSerializer
  | UserSimple
  | User,
  WriteOnlyUserSerializer
> {
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

  /** @override */
  override fromRaw(
    data:
      | ReadOnlyUserMeSerializer
      | ReadOnlyUserSerializer
      | ReadOnlyUserSimpleSerializer
      | ReadOnlyUserUpdateSerializer
      | UserSimple
      | User
  ): void {
    super.fromRaw(data);

    if ("is_org_admin" in data) {
      this.orgAdmin = data.is_org_admin;
    }

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

  /** @override */
  toJson(): WriteOnlyUserSerializer {
    return {
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
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
