import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { Channel, ChannelAdapter } from './channel';

// Describes a channel group object
export class ChannelGroup {
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public description: string,
    public orgId: number,
    public channelIds: number[]
  ) {
  }

  channels: Channel[];

  get channelsString(): string {
    return this.channelIds.toString();
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
}

export interface ApiPostChannelGroup {
  name: string;
  description: string;
  channels: number[];
  id?: number;
  organization: number;
}

@Injectable({
  providedIn: 'root',
})
export class ChannelGroupAdapter implements Adapter<ChannelGroup> {
  constructor(
    private channelAdapter: ChannelAdapter
  ){}
  adaptFromApi(item: ApiGetChannelGroup): ChannelGroup {
    let channelIds;
    let channels;

    if (item.channels[0] && typeof item.channels[0] === 'number') {
      channelIds = item.channels;
    } else {
      channelIds = item.channels;
      channels = item.channels.map( c => this.channelAdapter.adaptFromApi(c));
    }

    const channelGroup = new ChannelGroup(
      item.id,
      +item.user_id,
      item.name,
      item.description,
      item.organization,
      channelIds
    );

    channelGroup.channels = channels;
    return channelGroup;
  }

  adaptToApi(item: ChannelGroup): ApiPostChannelGroup {
    return {
      name: item.name,
      description: item.description,
      channels: item.channelIds,
      organization: item.orgId
    };
  }
}
