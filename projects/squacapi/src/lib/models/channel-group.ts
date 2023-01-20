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
    channelGroup.channelsCount = item.channelsCount;
    channelGroup.shareAll = item.shareAll ?? false;
    channelGroup.shareOrg = item.shareOrg ?? false;

    if ("channels" in item && item.channels) {
      channelGroup.channels = item.channels.map((c: ApiChannel) =>
        Channel.deserialize(c)
      );
    }
    if ("autoExcludeChannels" in item && item.autoExcludeChannels) {
      channelGroup.autoExcludeChannels = [...item.autoExcludeChannels].map(
        (c: ApiChannel | number) => {
          return typeof c === "number" ? c : Channel.deserialize(c);
        }
      );
    }

    if ("autoIncludeChannels" in item && item.autoIncludeChannels) {
      channelGroup.autoIncludeChannels = [...item.autoIncludeChannels].map(
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
      autoExcludeChannels: ex ?? [],
      autoIncludeChannels: incl ?? [],
      shareOrg: this.shareOrg,
      shareAll: this.shareAll,
    };
  }
}
