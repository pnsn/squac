import { ChannelGroup } from '../shared/channel-group';
import { Metric } from '../shared/metric';
import { Dashboard } from '../dashboards/dashboard';
import { Threshold } from './threshold';

export class Widget {
  public type: string;
  public dashboard: Dashboard;
  public channelGroup: ChannelGroup;
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public typeId: number,
    public dashboardId: number,
    public channelGroupId: number,
    public columns: number,
    public rows: number,
    public x: number,
    public y: number,
    public metrics: Metric[]
  ) {

  }
  public stattype;
  public thresholds: { [metridId: number]: Threshold};
  // get ids from the channels
  get metricsIds(): number[] {
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
