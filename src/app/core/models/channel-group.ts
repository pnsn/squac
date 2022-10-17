import { Injectable } from "@angular/core";
import { Adapter } from "./adapter";
import { Channel, ChannelAdapter } from "./channel";
import "@core/utils/utils.ts";
import { ApiChannel, ReadChannelGroup, WriteChannelGroup } from "./squac-types";
// Describes a channel group object

export class ChannelGroup {
  constructor(
    public id: number,
    public owner: number,
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

@Injectable({
  providedIn: "root",
})
export class ChannelGroupAdapter implements Adapter<ChannelGroup> {
  adaptFromApi(item: ReadChannelGroup): ChannelGroup {
    const channelAdapter = new ChannelAdapter();
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

    if ("channels" in item) {
      channelGroup.channels = item.channels.map((c: ApiChannel) =>
        channelAdapter.adaptFromApi(c)
      );
    }
    if ("auto_exclude_channels" in item) {
      channelGroup.autoExcludeChannels = [...item.auto_exclude_channels].map(
        (c: ApiChannel) => {
          return typeof c === "number" ? c : channelAdapter.adaptFromApi(c);
        }
      );
    }

    if ("auto_include_channels" in item) {
      channelGroup.autoIncludeChannels = [...item.auto_include_channels].map(
        (c: ApiChannel) => {
          return typeof c === "number" ? c : channelAdapter.adaptFromApi(c);
        }
      );
    }

    return channelGroup;
  }

  adaptToApi(item: ChannelGroup): WriteChannelGroup {
    const incl = new Set(item.autoExcludeChannels?.mapIds());
    const ex = new Set(item.autoExcludeChannels?.mapIds());

    return {
      name: item.name,
      description: item.description,
      organization: item.orgId,
      auto_exclude_channels: incl,
      auto_include_channels: ex,
      share_org: item.shareAll,
      share_all: item.shareOrg,
    };
  }
}
