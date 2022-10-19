import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { Channel, ChannelAdapter } from "../models/channel";
import {
  BaseApiService,
  ReadOnlyApiService,
} from "../interfaces/generic-api-service";
import {
  ApiService,
  NslcChannelsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { MatchingRule } from "../models/matching-rule";

@Injectable({
  providedIn: "root",
})
export class ChannelService
  extends BaseApiService<Channel>
  implements ReadOnlyApiService<Channel>
{
  constructor(protected api: ApiService, protected adapter: ChannelAdapter) {
    super("nslcChannels", api);
  }

  read(id: number): Observable<Channel> {
    return super.read(id);
  }

  list(params: NslcChannelsListRequestParams): Observable<Channel[]> {
    return super._list(params);
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
