import {
  ReadOnlyOrganizationSerializer,
  UserSimple,
} from "@pnsn/ngx-squacapi-client";
import { User } from ".";
import { ReadOnlyResourceModel } from "../interfaces";

export interface Organization {
  name: string;
  description: string;
  users: User[];
}
/**
 * Describes an organization
 */
export class Organization extends ReadOnlyResourceModel<ReadOnlyOrganizationSerializer> {
  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Organization";
  }

  override fromRaw(data: ReadOnlyOrganizationSerializer): void {
    super.fromRaw(data);

    if (data.users) {
      this.users = data.users.map((u: UserSimple) => new User(u));
    }
  }
}
