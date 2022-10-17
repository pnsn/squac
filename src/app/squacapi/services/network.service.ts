import { Injectable } from "@angular/core";
import { Network, NetworkAdapter } from "../models/network";
import { ListApiService } from "../interfaces/generic-api-service";
import { ApiService } from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})

// Service for handling networks
export class NetworkService extends ListApiService<Network> {
  constructor(
    protected api: ApiService,
    protected networkAdapter: NetworkAdapter
  ) {
    super("nslcNetworks", api);
  }
}
