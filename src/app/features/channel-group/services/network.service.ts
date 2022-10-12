import { Injectable } from "@angular/core";
import { Network, NetworkAdapter } from "@channelGroup/models/network";
import { ListApiService } from "@core/models/generic-api-service";
import {
  ApiService,
  NslcNetworksListRequestParams,
} from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})

// Service for handling networks
export class NetworkService extends ListApiService<Network> {
  constructor(private api: ApiService, networkAdapter: NetworkAdapter) {
    super(networkAdapter);
  }
  protected apiList = (params: NslcNetworksListRequestParams) =>
    this.api.nslcNetworksList(params);
}
