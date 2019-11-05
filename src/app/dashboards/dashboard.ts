import { Widget } from '../widgets/widget';
import { ChannelGroup } from '../shared/channel-group';

export class Dashboard {
  public channelGroup: ChannelGroup;
  public widgets: Widget[];
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public channelGroupId: number,
    public widgetIds?: number[]
  ) {
  }



}
