import { Channel } from './channel';

// Describes a channel group object
export class ChannelGroup {
  constructor(
    public id: number,
    public name: string,
    public description: string, 
    public channels?:Channel[]
  ) {
  }

  // get ids from the channels
  //TODO: shoould always store channel id only?
  get channelsIdsArray() : string[] {
    let array = [];

    this.channels.forEach(channel => {
      array.push(channel.id);
    })

    return array;
  }
}