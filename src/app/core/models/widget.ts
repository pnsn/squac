import { Dashboard } from '@features/dashboards/models/dashboard';
import { Threshold } from '@features/widgets/models/threshold';
import { ChannelGroup } from './channel-group';
import { Metric } from './metric';

export class Widget {
  public type: string;
  public dashboard: Dashboard;
  public channelGroup: ChannelGroup;
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public description: string,
    public orgId: number,
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
