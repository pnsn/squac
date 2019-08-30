import { Widget } from './widget';
import { ChannelGroup } from '../shared/channel-group';

export class Dashboard {
  public channelGroup: ChannelGroup;

  constructor(
    public id: number,
    public name: string,
    public description: string,
    public channelGroupId: number,
    public widgets?: Widget[]
  ){
  }


}
