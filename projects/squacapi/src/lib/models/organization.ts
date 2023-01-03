import { Injectable } from "@angular/core";
import { User, UserAdapter } from "../models";
import { Adapter, ReadOrganization, ApiUserSimple } from "../interfaces";

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
}
/**
 * Adapt an organization
 */
@Injectable({
  providedIn: "root",
})
export class OrganizationAdapter
  implements Adapter<Organization, ReadOrganization, unknown>
{
  /** @override */
  adaptFromApi(item: ReadOrganization): Organization {
    const userAdapter = new UserAdapter();
    let users: User[] = [];
    if (item.users) {
      users = item.users.map((u: ApiUserSimple) => userAdapter.adaptFromApi(u));
    }
    return new Organization(item.id, item.name, item.description, users);
  }
}
