import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";
import { ApiGetChannel, Channel } from "@core/models/channel";

export class Network {
  constructor(
    public code: string,
    public name: string,
    public description: string
  ) {}

  static get modelName() {
    return "Network";
  }
}

export interface ApiGetNetwork {
  class_name: string;
  code: string;
  name: string;
  url: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

@Injectable({
  providedIn: "root",
})
export class NetworkAdapter implements Adapter<Network> {
  adaptFromApi(item: ApiGetNetwork): Network {
    return new Network(item.code, item.name, item.description);
  }

  adaptToApi() {}
}
