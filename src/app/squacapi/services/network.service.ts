import { Injectable } from "@angular/core";
import { Network, NetworkAdapter } from "../models";
import { ListService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import {
  ApiService,
  NslcNetworksListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoint } from "../enums";

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
    super(ApiEndpoint.NETWORK, api);
  }

  list(
    params?: NslcNetworksListRequestParams,
    refresh?: boolean
  ): Observable<Network[]> {
    return super._list(params, { refresh });
  }
}
