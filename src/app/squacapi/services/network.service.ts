import { Injectable } from "@angular/core";
import { Network, NetworkAdapter } from "../models/network";
import { BaseApiService, ListService } from "../interfaces/generic-api-service";
import {
  ApiService,
  NslcNetworksListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})

// Service for handling networks
export class NetworkService
  extends BaseApiService<Network>
  implements ListService<Network>
{
  constructor(
    protected api: ApiService,
    protected networkAdapter: NetworkAdapter
  ) {
    super("nslcNetworks", api);
  }

  list(params?: NslcNetworksListRequestParams): Observable<Network[]> {
    return super._list(params);
  }
}
