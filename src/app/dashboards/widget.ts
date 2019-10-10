import { ChannelGroup } from '../shared/channel-group';
import { Metric } from '../shared/metric';
import { Dashboard } from './dashboard';

export class Widget {

  public description: string;
  public type: string;

  constructor(
    public id: number,
    public name: string,
    public typeId: number,
    public dashboardId: number,
    public metrics: Metric[]
  ) {

  }
  // json of settings

  // get ids from the channels
  get metricsIds(): string[] {
    const array = [];

    this.metrics.forEach(metric => {
      array.push(metric.id);
    });

    return array;
  }

  get metricsString(): string {
    return this.metricsIds.toString();
  }
}
