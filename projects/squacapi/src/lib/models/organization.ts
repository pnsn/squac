import { ReadOnlyOrganizationSerializer } from "@pnsn/ngx-squacapi-client";
import { User } from ".";
import {
  ReadOrganization,
  ApiUserSimple,
  ReadOnlyResourceModel,
} from "../interfaces";

/**
 * Describes an organization
 */
export class Organization extends ReadOnlyResourceModel<ReadOrganization> {
  name: string;
  description: string;
  users: User[];

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Organization";
  }

  fromRaw(data: ReadOnlyOrganizationSerializer): void {
    Object.assign(this, data);

    if (data.users) {
      this.users = data.users.map((u: ApiUserSimple) => User.deserialize(u));
    }
  }
}
