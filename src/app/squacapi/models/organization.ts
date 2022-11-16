import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter.interface";
import { User, UserAdapter } from "./user";
import { ReadOrganization, ApiUserSimple } from "../interfaces/squac-types";

// Describes a user object
export class Organization {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public users: User[]
  ) {}

  static get modelName() {
    return "Organization";
  }
}
@Injectable({
  providedIn: "root",
})
export class OrganizationAdapter implements Adapter<Organization> {
  adaptFromApi(item: ReadOrganization): Organization {
    const userAdapter = new UserAdapter();
    let users = [];
    if (item.users) {
      users = item.users.map((u: ApiUserSimple) => userAdapter.adaptFromApi(u));
    }
    return new Organization(item.id, item.name, item.description, users);
  }
}
