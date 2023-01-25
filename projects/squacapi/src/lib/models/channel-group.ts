import {
  ApiChannel,
  ReadChannelGroup,
  ResourceModel,
  WriteChannelGroup,
} from "../interfaces";
import { Channel } from ".";

/**
 * Describes a channel group object
 */
export class ChannelGroup extends ResourceModel<
  ReadChannelGroup,
  WriteChannelGroup
> {
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

  fromRaw(data: ReadChannelGroup): void {
    Object.apply(this, {
      id: +data.id,
      owner: data.user,
      name: data.name,
      description: data.description,
      orgId: data.organization,
      channelsCount: data.channels_count,
      shareAll: data.share_all,
      shareOrg: data.share_org,
    });

    if ("channels" in data && data.channels) {
      this.channels = data.channels.map((c: ApiChannel) =>
        Channel.deserialize(c)
      );
    }
    if ("auto_exclude_channels" in data && data.auto_exclude_channels) {
      this.autoExcludeChannels = [...data.auto_exclude_channels].map(
        (c: ApiChannel | number) => {
          return typeof c === "number" ? c : Channel.deserialize(c);
        }
      );
    }

    if ("auto_include_channels" in data && data.auto_include_channels) {
      this.autoIncludeChannels = [...data.auto_include_channels].map(
        (c: ApiChannel | number) => {
          return typeof c === "number" ? c : Channel.deserialize(c);
        }
      );
    }
  }

  toJson(): WriteChannelGroup {
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
