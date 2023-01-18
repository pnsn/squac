import { ApiChannel, ReadChannelGroup, WriteChannelGroup } from "../interfaces";
import { Channel } from ".";

/**
 * Describes a channel group object
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
   * @returns model name
   */
  static get modelName(): string {
    return "ChannelGroup";
  }

  /**
   *
   * @param item
   */
  static deserialize(item: ReadChannelGroup): ChannelGroup {
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
        Channel.deserialize(c)
      );
    }
    if ("auto_exclude_channels" in item && item.auto_exclude_channels) {
      channelGroup.autoExcludeChannels = [...item.auto_exclude_channels].map(
        (c: ApiChannel | number) => {
          return typeof c === "number" ? c : Channel.deserialize(c);
        }
      );
    }

    if ("auto_include_channels" in item && item.auto_include_channels) {
      channelGroup.autoIncludeChannels = [...item.auto_include_channels].map(
        (c: ApiChannel | number) => {
          return typeof c === "number" ? c : Channel.deserialize(c);
        }
      );
    }
    return channelGroup;
  }

  /**
   *
   */
  serialize(): WriteChannelGroup {
    const incl = this.autoIncludeChannels?.map((c): number =>
      typeof c === "number" ? c : c.id
    );
    const ex = this.autoExcludeChannels?.map((c) =>
      typeof c === "number" ? c : c.id
    );

    return {
      name: this.name,
      description: this.description,
      organization: this.orgId,
      auto_exclude_channels: ex ?? [],
      auto_include_channels: incl ?? [],
      share_org: this.shareOrg,
      share_all: this.shareAll,
    };
  }
}
