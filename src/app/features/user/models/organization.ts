import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";
import { ApiGetUser, User, UserAdapter } from "./user";

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

export interface ApiGetOrganization {
  id: number;
  name?: string;
  description: string;
  created_at: string;
  users?: ApiGetUser[];
}

@Injectable({
  providedIn: "root",
})
export class OrganizationAdapter implements Adapter<Organization> {
  constructor(private userAdapter: UserAdapter) {}
  adaptFromApi(item: ApiGetOrganization): Organization {
    let users = [];
    if (item.users) {
      users = item.users.map((u) => this.userAdapter.adaptFromApi(u));
    }
    return new Organization(item.id, item.name, item.description, users);
  }

  adaptToApi() {}
}
