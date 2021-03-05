import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { Channel, ChannelAdapter } from './channel';
import { Metric } from './metric';

// Describes a channel group object
export class ChannelGroup {
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public description: string,
    public orgId: number,
    public shareOrg: boolean,
    public shareAll: boolean,
    public channelIds: number[]
  ) {
  }

  channels: Channel[];

  get channelsString(): string {
    return this.channelIds.toString();
  }
}

export interface ApiGetChannelGroup {
  name?: string;
  id: number;
  url: string;
  description: string;
  channels: Array<number | any>;
  share_all: boolean;
  share_org: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  organization?: number;
}

@Injectable({
  providedIn: "root",
})
export class ChannelGroupAdapter implements Adapter<ChannelGroup> {
  constructor(
    private channelAdapter: ChannelAdapter
  ){}
  adapt(item: ApiGetChannelGroup): ChannelGroup {
    let channelIds;
    let channels;

    if(item.channels[0] && typeof item.channels[0] === "number") {
      channelIds = item.channels;
    } else {
      channelIds = item.channels;
      channels = item.channels.map( c => this.channelAdapter.adapt(c));
    }

    let channelGroup = new ChannelGroup(
      item.id,
      +item.user_id,
      item.name,
      item.description,
      item.organization,
      item.share_org,
      item.share_all,
      channelIds
      //TODO: deal with channels
    );

    channelGroup.channels = channels;
    return channelGroup;
  }
}
