import { User } from ".";
import { ReadOrganization, ApiUserSimple } from "../interfaces";

/**
 * Describes an organization
 */
export class Organization {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public users: User[]
  ) {}

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Organization";
  }

  /**
   *
   * @param item
   */
  static deserialize(item: ReadOrganization): Organization {
    let users: User[] = [];
    if (item.users) {
      users = item.users.map((u: ApiUserSimple) => User.deserialize(u));
    }
    return new Organization(item.id, item.name, item.description, users);
  }
}
