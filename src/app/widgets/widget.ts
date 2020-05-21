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
    public owner: number,
    public name: string,
    public description: string,
    public isPublic: boolean,
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
  public thresholds: { [metricId: number]: Threshold};
  // get ids from the channels
  get metricsIds(): number[] {
    const array = [];
    if (this.metrics) {
      this.metrics.forEach(metric => {
        array.push(metric.id);
      });
    }

    return array;
  }

  get metricsString(): string {
    return this.metricsIds.toString();
  }

 
  static get modelName() {
    return 'Widget';
  }
}
