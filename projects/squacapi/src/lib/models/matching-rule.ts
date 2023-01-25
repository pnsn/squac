import { ResourceModel } from "../interfaces";

import {
  ReadOnlyMatchingRuleSerializer,
  WriteOnlyMatchingRuleSerializer,
} from "@pnsn/ngx-squacapi-client";

export interface MatchingRule {
  channelGroupId: number;
  isInclude: boolean;
  networkRegex?: string;
  stationRegex?: string;
  locationRegex?: string;
  channelRegex?: string;
}

/**
 * Regular expression rules for building channel groups
 */
export class MatchingRule extends ResourceModel<
  ReadOnlyMatchingRuleSerializer | MatchingRule,
  WriteOnlyMatchingRuleSerializer
> {
  override fromRaw(data: ReadOnlyMatchingRuleSerializer | MatchingRule): void {
    super.fromRaw(data);
    if ("group" in data) {
      Object.assign(this, {
        channelGroupId: data.group,
        isInclude: data.is_include,
        channelRegex: data.channel_regex,
        networkRegex: data.network_regex,
        locationRegex: data.location_regex,
        stationRegex: data.station_regex,
      });
    }
  }

  toJson(): WriteOnlyMatchingRuleSerializer {
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
