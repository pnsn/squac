import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { Channel, ChannelAdapter } from "../models/channel";
import { ReadOnlyApiService } from "../interfaces/api-service.interface";
import { BaseApiService } from "./generic-api.service";
import {
  ApiService,
  NslcChannelsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { MatchingRule } from "../models/matching-rule";
import { ApiEndpoints } from "@squacapi/interfaces/api.interface";

@Injectable({
  providedIn: "root",
})
export class ChannelService
  extends BaseApiService<Channel>
  implements ReadOnlyApiService<Channel>
{
  constructor(protected api: ApiService, protected adapter: ChannelAdapter) {
    super(ApiEndpoints.CHANNEL, api);
  }

  read(id: number, refresh?: boolean): Observable<Channel> {
    return super.read(id, { refresh });
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
