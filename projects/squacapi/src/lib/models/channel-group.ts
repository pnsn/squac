import { Injectable } from "@angular/core";
import {
  Adapter,
  ApiChannel,
  ReadChannelGroup,
  WriteChannelGroup,
} from "../interfaces";
import { Channel } from "../models";
import { ChannelAdapter } from "../models/channel";

// Describes a channel group object

/**
 *
 */
export class ChannelGroup {
  id?: number;
  owner?: number;
  name = "";
  description? = "";
  orgId = 0;
  shareAll = false;
  shareOrg = false;

  // eventually group list wont return array of channels
  // which is why i've got these instead of channels.length
  channelsCount? = 0;

  channels?: (Channel | number)[] = [];
  autoIncludeChannels?: (Channel | number)[] = [];
  autoExcludeChannels?: (Channel | number)[] = [];

  /**
   *
   */
  static get modelName(): string {
    return "ChannelGroup";
  }
}

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class ChannelGroupAdapter
  implements Adapter<ChannelGroup, ReadChannelGroup, WriteChannelGroup>
{
  /**
   *
   * @param item
   */
  adaptFromApi(item: ReadChannelGroup): ChannelGroup {
    const channelAdapter = new ChannelAdapter();
    const id = item.id ? +item.id : undefined;
    const channelGroup = new ChannelGroup();

    channelGroup.id = id;
    channelGroup.owner = item.user;
    channelGroup.name = item.name;
    channelGroup.description = item.description;
    channelGroup.orgId = item.organization;
    channelGroup.channelsCount = item.channels_count;
    channelGroup.shareAll = item.share_all ?? false;
    channelGroup.shareOrg = item.share_org ?? false;

    if ("channels" in item && item.channels) {
      channelGroup.channels = item.channels.map((c: ApiChannel) =>
        channelAdapter.adaptFromApi(c)
      );
    }
    if ("auto_exclude_channels" in item && item.auto_exclude_channels) {
      channelGroup.autoExcludeChannels = [...item.auto_exclude_channels].map(
        (c: ApiChannel | number) => {
          return typeof c === "number" ? c : channelAdapter.adaptFromApi(c);
        }
      );
    }

    if ("auto_include_channels" in item && item.auto_include_channels) {
      channelGroup.autoIncludeChannels = [...item.auto_include_channels].map(
        (c: ApiChannel | number) => {
          return typeof c === "number" ? c : channelAdapter.adaptFromApi(c);
        }
      );
    }
    return channelGroup;
  }

  /**
   *
   * @param item
   */
  adaptToApi(item: ChannelGroup): WriteChannelGroup {
    const incl = item.autoIncludeChannels?.map((c): number =>
      typeof c === "number" ? c : c.id
    );
    const ex = item.autoExcludeChannels?.map((c) =>
      typeof c === "number" ? c : c.id
    );

    return {
      name: item.name,
      description: item.description,
      organization: item.orgId,
      auto_exclude_channels: ex ?? [],
      auto_include_channels: incl ?? [],
      share_org: item.shareOrg,
      share_all: item.shareAll,
    };
  }
}
