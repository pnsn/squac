import { Channel } from './channel';

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
