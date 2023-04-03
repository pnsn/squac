import {
  ReadOnlyUserMeSerializer,
  ReadOnlyUserSerializer,
  ReadOnlyUserSimpleSerializer,
  ReadOnlyUserUpdateSerializer,
  UserSimple,
} from "@pnsn/ngx-squacapi-client";
import { ResourceModel } from "../interfaces";

/**
 * Generated serializer uses a set for groups, which client
 * does not handle correctly
 */
export interface WriteOnlyUserSerializer {
  email: string;
  firstname: string;
  lastname: string;
  groups: Array<string>;
  organization: number;
  is_org_admin?: boolean;
  last_login?: string | null;
  is_active?: boolean;
}

export interface User {
  email: string;
  firstname: string;
  lastname: string;
  isOrgAdmin: boolean;
  groups: Array<string>;
  lastLogin: string;
  isStaff: boolean;
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
   * @returns true if user is an org admin
   */
  get isAdmin(): boolean {
    return this.isOrgAdmin; // or is an admin of the current group?
  }

  /**
   * @returns user's first and last name
   */
  get fullName(): string {
    return `${this.firstname} ${this.lastname}`;
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

    if (data.groups) {
      this.groups = Array.from(data.groups);
    }
  }

  /** @override */
  toJson(): WriteOnlyUserSerializer {
    return {
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      organization: this.orgId,
      is_org_admin: this.isOrgAdmin,
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
    return this.groups.indexOf(group) > -1;
  }
}
