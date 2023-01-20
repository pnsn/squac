import { ReadMatchingRule, WriteMatchingRule } from "../interfaces";

/**
 * Regular expression rules for building channel groups
 */
export class MatchingRule {
  constructor(
    public id: number,
    public owner: number,
    public channelGroupId: number,
    public isInclude: boolean
  ) {}
  networkRegex?: string;
  stationRegex?: string;
  locationRegex?: string;
  channelRegex?: string;

  /**
   *
   * @param item
   */
  static deserialize(item: ReadMatchingRule): MatchingRule {
    const matchingRule = new MatchingRule(
      item.id ? +item.id : 0,
      item.user ? item.user : 0,
      item.group,
      item.is_include ?? true
    );

    matchingRule.channelRegex = item.channel_regex;
    matchingRule.networkRegex = item.network_regex;
    matchingRule.locationRegex = item.location_regex;
    matchingRule.stationRegex = item.station_regex;

    return matchingRule;
  }

  /**
   *
   */
  serialize(): WriteMatchingRule {
    return {
      group: this.channelGroupId,
      network_regex: this.networkRegex,
      station_regex: this.stationRegex,
      location_regex: this.locationRegex,
      channel_regex: this.channelRegex,
      is_include: this.isInclude,
    };
  }
}
