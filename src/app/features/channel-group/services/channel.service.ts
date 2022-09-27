import { Injectable } from "@angular/core";

import { map } from "rxjs/operators";
import { Channel, ChannelAdapter } from "@core/models/channel";
import { Observable } from "rxjs";
import { SquacApiService } from "@core/services/squacapi.service";
import { Params } from "@angular/router";
import { MatchingRule } from "../models/matching-rule";

@Injectable({
  providedIn: "root",
})
export class ChannelService {
  private url = "nslc/channels/";
  constructor(
    private squacApi: SquacApiService,
    private channelAdapter: ChannelAdapter
  ) {}

  getChannelsByFilters(filters: Params): Observable<Channel[]> {
    return this.squacApi
      .get(this.url, null, filters)
      .pipe(
        map((response) =>
          response.map((r) => this.channelAdapter.adaptFromApi(r))
        )
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
          this.getChannelsByFilters({
            net_search: rule.networkRegex,
            sta_search: rule.stationRegex,
            loc_search: rule.locationRegex,
            chan_search: rule.channelRegex,
            ...params,
          })
        );
      }
    });

    return ruleSubs;
  }
}
