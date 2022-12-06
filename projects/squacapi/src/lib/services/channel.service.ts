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

@Injectable({
  providedIn: "root",
})
export class ChannelService
  extends BaseApiService<Channel>
  implements ReadOnlyApiService<Channel>
{
  constructor(override api: ApiService, override adapter: ChannelAdapter) {
    super(ApiEndpoint.CHANNEL, api);
  }

  override read(id: number, refresh?: boolean): Observable<Channel> {
    return super.read(id, refresh);
  }

  list(
    params: NslcChannelsListRequestParams,
    refresh?: boolean
  ): Observable<Channel[]> {
    return super._list(params, { refresh });
  }

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
