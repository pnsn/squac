import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { Channel, ChannelAdapter } from "@core/models/channel";
import { ReadApiService } from "@core/models/generic-api-service";
import {
  ApiService,
  NslcChannelsListRequestParams,
  NslcChannelsReadRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { MatchingRule } from "../models/matching-rule";

@Injectable({
  providedIn: "root",
})
export class ChannelService extends ReadApiService<Channel> {
  constructor(private api: ApiService, channelAdapter: ChannelAdapter) {
    super(channelAdapter);
  }

  protected apiList = (params: NslcChannelsListRequestParams) =>
    this.api.nslcChannelsList(params);
  protected apiRead = (params: NslcChannelsReadRequestParams) =>
    this.api.nslcChannelsRead(params);

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
