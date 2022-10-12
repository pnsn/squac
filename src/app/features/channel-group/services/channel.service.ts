import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { Channel, ChannelAdapter } from "@core/models/channel";
import { ListApiService } from "@core/models/generic-api-service";
import {
  ApiService,
  NslcChannelsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { MatchingRule } from "../models/matching-rule";

@Injectable({
  providedIn: "root",
})
export class ChannelService extends ListApiService<Channel> {
  constructor(private api: ApiService, channelAdapter: ChannelAdapter) {
    super(channelAdapter);
  }

  protected apiList = (params: NslcChannelsListRequestParams) =>
    this.api.nslcChannelsList(params);

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
