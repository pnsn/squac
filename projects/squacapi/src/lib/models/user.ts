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
  isOrgAdmin: boolean;
  groups: Set<string>;
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

    this.groups = new Set<string>(data.groups);
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
    return this.groups.has(group);
  }
}
