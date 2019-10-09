import { ChannelGroup } from '../shared/channel-group';
import { Metric } from '../shared/metric';
import { Dashboard } from './dashboard';

export class Widget {

  public description: string;
  public dashboard: Dashboard;

  constructor(public id: number, public name: string, public type: string, public metrics: Metric[]) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.metrics = metrics;
  }
  // json of settings

  // get ids from the channels
  get metricsIdsArray(): string[] {
    const array = [];

    this.metrics.forEach(channel => {
      array.push(channel.id);
    });

    return array;
  }

  get metricsString(): string {
    return this.metricsIdsArray.toString();
  }
}
