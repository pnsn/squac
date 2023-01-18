import { Injectable } from "@angular/core";
import { Network } from "../models";
import { ListService } from "../interfaces";
import { BaseReadOnlyApiService } from "./generic-api.service";
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
export class NetworkService extends BaseReadOnlyApiService<Network> {
  constructor(override api: ApiService) {
    super(ApiEndpoint.NETWORK, api);
  }
  deserialize = Network.deserialize;
}

export interface NetworkService extends ListService<Network> {
  list(
    params?: NslcNetworksListRequestParams,
    refresh?: boolean
  ): Observable<Network[]>;
}
