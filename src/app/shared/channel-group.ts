import { Channel } from './channel';

// Describes a channel group object
export class ChannelGroup {
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public description: string,
    public channels?: Channel[]
  ) {
  }

  // get ids from the channels
  get channelsIdsArray(): string[] {
    const array = [];

    this.channels.forEach(channel => {
      array.push(channel.id);
    });

    return array;
  }

  get channelsString(): string {
    return this.channelsIdsArray.toString();
  }
}
