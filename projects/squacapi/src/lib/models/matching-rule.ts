import {
  ReadMatchingRule,
  ResourceModel,
  WriteMatchingRule,
} from "../interfaces";

/**
 * Regular expression rules for building channel groups
 */
export class MatchingRule extends ResourceModel<
  ReadMatchingRule,
  WriteMatchingRule
> {
  owner: number;
  channelGroupId: number;
  isInclude: boolean;
  networkRegex?: string;
  stationRegex?: string;
  locationRegex?: string;
  channelRegex?: string;

  fromRaw(data: ReadMatchingRule): void {
    Object.assign(this, {
      id: data.id,
      owner: data.user,
      channelGroupId: data.group,
      isInclude: data.is_include,
      channelRegex: data.channel_regex,
      networkRegex: data.network_regex,
      locationRegex: data.location_regex,
      stationRegex: data.station_regex,
    });
  }

  toJson(): WriteMatchingRule {
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
