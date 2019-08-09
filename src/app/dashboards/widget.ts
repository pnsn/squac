import { MetricGroup } from '../shared/metric-group';
import { ChannelGroup } from '../shared/channel-group';

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
