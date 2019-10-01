import { ChannelGroup } from '../shared/channel-group';
import { Metric } from '../shared/metric';

export class Widget {
  public id: number;
  public name: string;
  public description: string;
  public metrics: Metric[];
  public channelGroups: ChannelGroup[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
  // json of settings
}
