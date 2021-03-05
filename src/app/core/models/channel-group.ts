import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { Channel } from './channel';
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


export interface apiGetChannelGroup {
  name: string;
  id: number;
  url: string;
  description: string;
  channels: Array<number | any>;
  share_all: boolean;
  share_org: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  organization: number;
}

@Injectable({
  providedIn: "root",
})
export class ChannelGroupAdapter implements Adapter<ChannelGroup> {
  adapt(item: apiGetChannelGroup): ChannelGroup {
    return new ChannelGroup(
      item.id,
      +item.user_id,
      item.name,
      item.description,
      item.organization,
      item.share_org,
      item.share_all,
      item.channels
    );
  }
}
