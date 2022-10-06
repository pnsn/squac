import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";
import { User, UserAdapter } from "./user";
import { ReadOrganization, ApiUserSimple } from "@core/models/squac-types";

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
  constructor(private userAdapter: UserAdapter) {}
  adaptFromApi(item: ReadOrganization): Organization {
    let users = [];
    if (item.users) {
      users = item.users.map((u: ApiUserSimple) =>
        this.userAdapter.adaptFromApi(u)
      );
    }
    return new Organization(item.id, item.name, item.description, users);
  }
}
