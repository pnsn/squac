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

  autoIncludeChannelIds: number[];
  autoExcludeChannelIds: number[];

  get length(): number {
    return this.channelIds.length;
  }
  channels: Channel[];

  get channelsString(): string {
    console.log(this.channelIds.toString());
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
  user_id: string;
  organization: number;
  auto_include_channels: number[];
  auto_exclude_channels: number[];
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

    if (item.channels[0] && typeof item.channels[0] === "number") {
      channelIds = item.channels;
      channels = [];
    } else {
      channelIds = [];
      channels = item.channels.map((c) => {
        channelIds.push(c.id);
        return this.channelAdapter.adaptFromApi(c);
      });
    }

    const channelGroup = new ChannelGroup(
      item.id,
      +item.user_id,
      item.name,
      item.description,
      item.organization,
      channelIds
    );

    channelGroup.autoIncludeChannelIds = item.auto_include_channels || [];
    channelGroup.autoExcludeChannelIds = item.auto_exclude_channels || [];

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
