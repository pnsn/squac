import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { Channel, ChannelAdapter } from "../models/channel";
import { ListApiService } from "../interfaces/generic-api-service";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { MatchingRule } from "../models/matching-rule";

@Injectable({
  providedIn: "root",
})
export class ChannelService extends ListApiService<Channel> {
  constructor(protected api: ApiService, protected adapter: ChannelAdapter) {
    super("nslcChannels", api);
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
