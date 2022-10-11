import { Injectable } from "@angular/core";

import { map } from "rxjs/operators";
import { Channel, ChannelAdapter } from "@core/models/channel";
import { Observable } from "rxjs";
import { Params } from "@angular/router";
import { MatchingRule } from "../models/matching-rule";
import {
  ApiService,
  NslcChannelsListRequestParams,
} from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class ChannelService {
  constructor(
    private api: ApiService,
    private channelAdapter: ChannelAdapter
  ) {}

  list(params: NslcChannelsListRequestParams): Observable<Channel[]> {
    return this.api.nslcChannelsList(params).pipe(
      map((response) => {
        return response.map(this.channelAdapter.adaptFromApi);
      })
    );
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
