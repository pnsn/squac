import { Injectable } from "@angular/core";
import { Network, NetworkAdapter } from "../models/network";
import { ListService } from "../interfaces/api-service.interface";
import { BaseApiService } from "./generic-api.service";
import {
  ApiService,
  NslcNetworksListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoints } from "@squacapi/interfaces/api.interface";

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
    super(ApiEndpoints.NETWORK, api);
  }

  list(params?: NslcNetworksListRequestParams): Observable<Network[]> {
    return super._list(params, { refresh });
  }
}