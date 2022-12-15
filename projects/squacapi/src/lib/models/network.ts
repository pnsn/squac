import { Injectable } from "@angular/core";
import { Adapter, ReadNetwork } from "../interfaces";

/**
 *
 */
export class Network {
  id: number;
  constructor(
    public code: string,
    public name: string,
    public description: string
  ) {}

  /**
   *
   */
  static get modelName(): string {
    return "Network";
  }
}

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class NetworkAdapter implements Adapter<Network, ReadNetwork, unknown> {
  /**
   *
   * @param item
   */
  adaptFromApi(item: ReadNetwork): Network {
    return new Network(item.code, item.name, item.description);
  }
}
