import { Injectable } from '@angular/core';

// Describes a channel group object
export class Archive {
  constructor(
  ) {
  }
}

export interface ApiGetChannelGroup {
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

export interface ApiPostChannelGroup {
  name: string;
  description: string;
  channels: number[];
  share_org: boolean;
  share_all: boolean;
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
      item.share_org,
      item.share_all,
      channelIds
      // TODO: deal with channels
    );

    channelGroup.channels = channels;
    return channelGroup;
  }

  adaptToApi(item: ChannelGroup): ApiPostChannelGroup {
    return {
      name: item.name,
      description: item.description,
      share_org: item.shareOrg,
      share_all: item.shareAll,
      channels: item.channelIds,
      organization: item.orgId
    };
  }
}
