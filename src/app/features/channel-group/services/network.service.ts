import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { SquacApiService } from "@core/services/squacapi.service";
import { Network, NetworkAdapter } from "@channelGroup/models/network";
import {
  ApiService,
  NslcNetworksListRequestParams,
  ReadOnlyNetworkSerializer,
} from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})

// Service for handling networks
export class NetworkService {
  networks: Network[];
  private url = "nslc/networks/";
  // Subscribeable networks
  constructor(
    private api: ApiService,
    private networkAdapter: NetworkAdapter
  ) {}

  list(params: NslcNetworksListRequestParams) {
    this.api.nslcNetworksList(params).pipe(
      map((response: ReadOnlyNetworkSerializer[]) => {
        return response.map(this.networkAdapter.adaptFromApi);
      })
    );
  }
}
