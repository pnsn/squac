import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import {
  ApiService,
  NslcChannelsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

import { Channel, ChannelAdapter, MatchingRule } from "../models";
import { ReadOnlyApiService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import { ApiEndpoint } from "../enums";

/**
 * Service for managing channels
 */
@Injectable({
  providedIn: "root",
})
export class ChannelService extends BaseApiService<Channel> {
  constructor(override api: ApiService, override adapter: ChannelAdapter) {
    super(ApiEndpoint.CHANNEL, api);
  }

  /**
   * Requests channels using params and matching rules
   *
   * @param rules matching rules
   * @param params channel request params
   * @returns channels matching requests
   */
  getChannelsByRules(
    rules: MatchingRule[],
    params?: Params
  ): Observable<Channel[]>[] {
    const ruleSubs: Observable<Channel[]>[] = [];

    rules.forEach((rule) => {
      if (rule.isInclude) {
        ruleSubs.push(
          this.list({
            netSearch: rule.networkRegex,
            staSearch: rule.stationRegex,
            locSearch: rule.locationRegex,
            chanSearch: rule.channelRegex,
            ...params,
          })
        );
      }
    });

    return ruleSubs;
  }
}

export interface ChannelService extends ReadOnlyApiService<Channel> {
  read(id: number, refresh?: boolean): Observable<Channel>;
  list(
    params: NslcChannelsListRequestParams,
    refresh?: boolean
  ): Observable<Channel[]>;
}
