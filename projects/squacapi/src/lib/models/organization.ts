import {
  ReadOnlyOrganizationSerializer,
  UserSimple,
} from "@pnsn/ngx-squacapi-client";
import { User } from ".";
import { ReadOnlyResourceModel } from "../interfaces";

/**
 * Describes an organization
 */
export class Organization extends ReadOnlyResourceModel<ReadOnlyOrganizationSerializer> {
  name: string;
  description: string;
  users: User[];

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
