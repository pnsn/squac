import { Injectable } from "@angular/core";
import { Adapter } from "./adapter";
import { ApiGetChannel, Channel, ChannelAdapter } from "./channel";
import "@core/utils/utils.ts";
// Describes a channel group object
export class ChannelGroup {
  constructor(
    public id: number,
    public owner: string,
    public name: string,
    public description: string,
    public orgId: number
  ) {}

  shareAll = false;
  shareOrg = false;

  // eventually group list wont return array of channels
  // which is why i've got these instead of channels.length
  channelsCount = 0;

  channels: Channel[] = [];
  autoIncludeChannels: Channel[] = [];
  autoExcludeChannels: Channel[] = [];

  static get modelName() {
    return "ChannelGroup";
  }
}

export interface ApiGetChannelGroup {
  name: string;
  id: number;
  description: string;
  created_at: string;
  updated_at: string;
  user: string;
  organization: number;
  channels?: Array<ApiGetChannel>;
  auto_include_channels?: Array<ApiGetChannel>;
  auto_exclude_channels?: Array<ApiGetChannel>;
  channels_count?: number;
  share_org: boolean;
  share_all: boolean;
}

export interface ApiPostChannelGroup {
  name: string;
  description: string;
  id?: number;
  organization: number;
  auto_include_channels: number[];
  auto_exclude_channels: number[];
  share_org: boolean;
  share_all: boolean;
}

@Injectable({
  providedIn: "root",
})
export class ChannelGroupAdapter implements Adapter<ChannelGroup> {
  constructor(private channelAdapter: ChannelAdapter) {}
  adaptFromApi(item: ApiGetChannelGroup): ChannelGroup {
    const channelGroup = new ChannelGroup(
      item.id,
      item.user,
      item.name,
      item.description,
      item.organization
    );

    channelGroup.channelsCount = item.channels_count;
    channelGroup.shareAll = item.share_all;
    channelGroup.shareOrg = item.share_org;
    if (
      item.channels ||
      item.auto_exclude_channels ||
      item.auto_include_channels
    ) {
      channelGroup.autoExcludeChannels = item.auto_exclude_channels.map((c) => {
        return typeof c === "number" ? c : this.channelAdapter.adaptFromApi(c);
      });
      channelGroup.autoIncludeChannels = item.auto_include_channels.map((c) => {
        return typeof c === "number" ? c : this.channelAdapter.adaptFromApi(c);
      });
      channelGroup.channels = item.channels.map((c) => {
        return typeof c === "number" ? c : this.channelAdapter.adaptFromApi(c);
      });
    }

    return channelGroup;
  }

  adaptToApi(item: ChannelGroup): ApiPostChannelGroup {
    return {
      name: item.name,
      description: item.description,
      organization: item.orgId,
      auto_exclude_channels: item.autoExcludeChannels?.mapIds(),
      auto_include_channels: item.autoIncludeChannels?.mapIds(),
      share_org: item.shareAll,
      share_all: item.shareOrg,
    };
  }
}
