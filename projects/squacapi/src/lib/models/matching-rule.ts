import { Injectable } from "@angular/core";
import { Adapter, ReadMatchingRule, WriteMatchingRule } from "../interfaces";
// Rules for building channel groups
export class MatchingRule {
  constructor(
    public id: number,
    public owner: number,
    public channelGroupId: number,
    public isInclude: boolean
  ) {}
  networkRegex: string;
  stationRegex: string;
  locationRegex: string;
  channelRegex: string;
}

@Injectable({
  providedIn: "root",
})
export class MatchingRuleAdapter implements Adapter<MatchingRule> {
  adaptFromApi(item: ReadMatchingRule): MatchingRule {
    const matchingRule = new MatchingRule(
      item.id,
      item.user,
      item.group,
      item.is_include
    );

    matchingRule.channelRegex = item.channel_regex;
    matchingRule.networkRegex = item.network_regex;
    matchingRule.locationRegex = item.location_regex;
    matchingRule.stationRegex = item.station_regex;

    return matchingRule;
  }

  adaptToApi(item: MatchingRule): WriteMatchingRule {
    return {
      group: item.channelGroupId,
      network_regex: item.networkRegex,
      station_regex: item.stationRegex,
      location_regex: item.locationRegex,
      channel_regex: item.channelRegex,
      is_include: item.isInclude,
    };
  }
}
