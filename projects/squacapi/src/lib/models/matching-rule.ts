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
      item.isInclude ?? true
    );

    matchingRule.channelRegex = item.channelRegex;
    matchingRule.networkRegex = item.networkRegex;
    matchingRule.locationRegex = item.locationRegex;
    matchingRule.stationRegex = item.stationRegex;

    return matchingRule;
  }

  /**
   *
   */
  serialize(): WriteMatchingRule {
    return {
      group: this.channelGroupId,
      networkRegex: this.networkRegex,
      stationRegex: this.stationRegex,
      locationRegex: this.locationRegex,
      channelRegex: this.channelRegex,
      isInclude: this.isInclude,
    };
  }
}
