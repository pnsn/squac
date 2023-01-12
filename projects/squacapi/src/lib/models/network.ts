import { Injectable } from "@angular/core";
import { Adapter, ReadNetwork } from "../interfaces";

/**
 * describes a network
 */
export class Network {
  id: number;
  constructor(
    public code: string,
    public name: string,
    public description: string
  ) {}

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Network";
  }
}

/**
 * Adapt network
 */
@Injectable({
  providedIn: "root",
})
export class NetworkAdapter implements Adapter<Network, ReadNetwork, unknown> {
  /** @override */
  adaptFromApi(item: ReadNetwork): Network {
    return new Network(item.code, item.name, item.description);
  }
}
