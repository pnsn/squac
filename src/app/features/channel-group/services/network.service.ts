import { Injectable } from "@angular/core";
import { NetworkAdapter } from "@channelGroup/models/network";
import { ReadApiService } from "@core/models/generic-api-service";
import {
  ApiService,
  NslcNetworksListRequestParams,
  NslcNetworksReadRequestParams,
} from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})

// Service for handling networks
export class NetworkService extends ReadApiService<Network> {
  constructor(private api: ApiService, networkAdapter: NetworkAdapter) {
    super(networkAdapter);
  }
  protected apiList = (params: NslcNetworksListRequestParams) =>
    this.api.nslcNetworksList(params);
  protected apiRead = (params: NslcNetworksReadRequestParams) =>
    this.api.nslcNetworksRead(params);
}
