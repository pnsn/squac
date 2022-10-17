import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";
import { ReadNetwork } from "../interfaces/squac-types";

export class Network {
  id: number;
  constructor(
    public code: string,
    public name: string,
    public description: string
  ) {}

  static get modelName() {
    return "Network";
  }
}

@Injectable({
  providedIn: "root",
})
export class NetworkAdapter implements Adapter<Network> {
  adaptFromApi(item: ReadNetwork): Network {
    return new Network(item.code, item.name, item.description);
  }
}
