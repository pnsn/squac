import { Injectable } from "@angular/core";
import { Adapter } from "./adapter";
import { Channel, ChannelAdapter } from "./channel";

// Describes a channel group object
export class ChannelGroup {
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public description: string,
    public orgId: number,
    public channelIds: number[]
  ) {}

  autoIncludeChannelIds: number[] = [];
  autoExcludeChannelIds: number[] = [];

  get length(): number {
    return this.channelIds.length;
  }
  channels: Channel[];
  autoIncludeChannels: Channel[] = [];
  autoExcludeChannels: Channel[] = [];
  get channelsString(): string {
    return this.channelIds.toString();
  }

  static get modelName() {
    return "ChannelGroup";
  }
}

export interface ApiGetChannelGroup {
  name: string;
  id: number;
  url: string;
  description: string;
  channels: Array<number | any>;
  created_at: string;
  updated_at: string;
  user: number;
  organization: number;
  auto_include_channels: Array<number | any>;
  auto_exclude_channels: Array<number | any>;
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
    let channelIds;
    let channels;
    let includeChannelIds = [];
    let excludeChannelIds = [];
    let includeChannels;
    let excludeChannels;

    //short response from
    if (
      typeof item.channels[0] === "number" ||
      typeof item.auto_exclude_channels[0] === "number" ||
      typeof item.auto_include_channels[0] === "number"
    ) {
      channelIds = item.channels;
      includeChannelIds = item.auto_include_channels;
      excludeChannelIds = item.auto_exclude_channels;
      channels = [];
      includeChannels = [];
      excludeChannels = [];
      //full response
    } else {
      channelIds = [];
      channels = item.channels.map((c) => {
        channelIds.push(c.id);
        return this.channelAdapter.adaptFromApi(c);
      });
      includeChannels = item.auto_include_channels.map((c) => {
        includeChannelIds.push(c.id);
        const d = this.channelAdapter.adaptFromApi(c);
        return d;
      });
      excludeChannels = item.auto_exclude_channels.map((c) => {
        excludeChannelIds.push(c.id);
        return this.channelAdapter.adaptFromApi(c);
      });
    }

    const channelGroup = new ChannelGroup(
      item.id,
      item.user,
      item.name,
      item.description,
      item.organization,
      channelIds
    );

    channelGroup.autoIncludeChannels = includeChannels;
    channelGroup.autoExcludeChannels = excludeChannels;
    channelGroup.autoIncludeChannelIds = includeChannelIds;
    channelGroup.autoExcludeChannelIds = excludeChannelIds;
    channelGroup.channels = channels;
    return channelGroup;
  }

  adaptToApi(item: ChannelGroup): ApiPostChannelGroup {
    return {
      name: item.name,
      description: item.description,
      channels: item.channelIds || [],
      organization: item.orgId,
      auto_exclude_channels: item.autoExcludeChannelIds || [],
      auto_include_channels: item.autoIncludeChannelIds || [],
    };
  }
}
