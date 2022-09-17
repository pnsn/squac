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

  channelsCount;
  autoIncludeChannelsCount;
  autoExcludeChannelsCount;

  channels: Channel[];
  autoIncludeChannels: Channel[] = [];
  autoExcludeChannels: Channel[] = [];

  static get modelName() {
    return "ChannelGroup";
  }
}

export interface ApiGetChannelGroup {
  name: string;
  id: number;
  url: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: string;
  organization: number;
  channels?: Array<ApiGetChannel>;
  auto_include_channels?: Array<ApiGetChannel>;
  auto_exclude_channels?: Array<ApiGetChannel>;
  channels_count?: number;
  auto_include_channels_count?: number;
  auto_exclude_channels_count;
}

export interface ApiPostChannelGroup {
  name: string;
  description: string;
  channels: number[];
  id?: number;
  organization: number;
  auto_include_channels: number[];
  auto_exclude_channels: number[];
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

    channelGroup.channelsCount = item.channels_count ?? item.channels?.length;
    channelGroup.autoExcludeChannelsCount =
      item.auto_exclude_channels_count ?? item.auto_exclude_channels?.length;
    channelGroup.autoIncludeChannelsCount =
      item.auto_include_channels_count ?? item.auto_include_channels?.length;

    channelGroup.autoIncludeChannels = item.auto_include_channels?.map((c) => {
      return typeof c === "number" ? c : this.channelAdapter.adaptFromApi(c);
    });
    channelGroup.autoExcludeChannels = item.auto_exclude_channels?.map((c) => {
      return typeof c === "number" ? c : this.channelAdapter.adaptFromApi(c);
    });
    channelGroup.channels = item.channels?.map((c) => {
      return typeof c === "number" ? c : this.channelAdapter.adaptFromApi(c);
    });
    return channelGroup;
  }

  adaptToApi(item: ChannelGroup): ApiPostChannelGroup {
    return {
      name: item.name,
      description: item.description,
      channels: item.channels?.mapIds(),
      organization: item.orgId,
      auto_exclude_channels: item.autoExcludeChannels?.mapIds(),
      auto_include_channels: item.autoIncludeChannels?.mapIds(),
    };
  }
}
