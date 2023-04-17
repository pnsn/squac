import { ReadOnlyNetworkSerializer } from "@pnsn/ngx-squacapi-client";
import { ReadOnlyResourceModel } from "../interfaces";

export interface Network {
  code: string;
  name: string;
  description: string;
}

/**
 * describes a network
 */
export class Network extends ReadOnlyResourceModel<
  ReadOnlyNetworkSerializer | Network
> {
  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Network";
  }
}
