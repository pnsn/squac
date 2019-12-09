import { Widget } from '../widgets/widget';
import { ChannelGroup } from '../shared/channel-group';

export class Dashboard {
  public widgets: Widget[];
  public startdate: Date;
  public enddate: Date;

  constructor(
    public id: number,
    public name: string,
    public description: string,
    public widgetIds?: number[]
  ) {
  }



}
