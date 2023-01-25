import { ReadOnlyNetworkSerializer } from "@pnsn/ngx-squacapi-client";
import { ReadNetwork, ReadOnlyResourceModel } from "../interfaces";

/**
 * describes a network
 */
export class Network extends ReadOnlyResourceModel<ReadNetwork> {
  code: string;
  name: string;
  description: string;

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Network";
  }

  fromRaw(data: ReadOnlyNetworkSerializer): void {
    Object.assign(this, data);
  }
}
