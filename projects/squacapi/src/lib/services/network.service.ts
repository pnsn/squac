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

/**
 * Service for requesting networks from squacapi
 */
@Injectable({
  providedIn: "root",
})
export class NetworkService extends BaseApiService<Network> {
  constructor(
    override api: ApiService,
    protected networkAdapter: NetworkAdapter
  ) {
    super(ApiEndpoint.NETWORK, api);
  }
}

export interface NetworkService extends ListService<Network> {
  list(
    params?: NslcNetworksListRequestParams,
    refresh?: boolean
  ): Observable<Network[]>;
}
