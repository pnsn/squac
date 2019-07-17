import { MetricGroup } from './metric-group';
import { ChannelGroup } from './channel-group';

export class Widget {
  public id: number;
  public name: string;
  public description: string;
  public metricGroups: MetricGroup[];
  public channelGroups : ChannelGroup[];

  constructor(id: number, name:string) {
    this.id = id;
    this.name = name;
  }
  //json of settings
}
