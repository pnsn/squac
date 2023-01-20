import { ReadUser, WriteUser } from "../interfaces";

/**
 * Describes a user object
 */
export class User {
  constructor(
    public id: number,
    public email: string,
    public firstName: string,
    public lastName: string,
    public orgId: number,
    public orgAdmin: boolean,
    public groups: Set<string>
  ) {}
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

  /**
   *
   * @param item
   */
  static deserialize(item: ReadUser): User {
    const user = new User(
      item.id,
      item.email,
      item.firstname,
      item.lastname,
      item.organization,
      item.isOrgAdmin,
      item.groups
    );
    if ("lastLogin" in item) {
      user.lastLogin = item.lastLogin;
    }

    if ("isStaff" in item) {
      user.squacAdmin = item.isStaff;
    }

    if ("isActive" in item) {
      user.isActive = item.isActive;
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
    return this.groups && this.groups.has(group);
  }

  /**
   *
   */
  serialize(): WriteUser {
    return {
      email: this.email,
      firstname: this.firstName,
      lastname: this.lastName,
      organization: this.orgId,
      isOrgAdmin: this.orgAdmin,
      isActive: this.isActive,
      groups: this.groups,
    };
  }
}
