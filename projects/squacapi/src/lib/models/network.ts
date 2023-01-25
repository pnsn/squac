import { ReadOnlyNetworkSerializer } from "@pnsn/ngx-squacapi-client";
import { ReadOnlyResourceModel } from "../interfaces";

/**
 * describes a network
 */
export class Network extends ReadOnlyResourceModel<ReadOnlyNetworkSerializer> {
  code: string;
  name: string;
  description: string;

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Network";
  }
}
