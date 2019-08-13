import { Widget } from './widget';
import { Metric } from '../shared/metric';
import { ChannelGroup } from '../shared/channel-group';

export class Dashboard {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public widgets: Widget[],
    public metrics: Metric[],
    public channelGroup : ChannelGroup
  ){
  }
}
