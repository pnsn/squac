import { ChannelGroup } from '../shared/channel-group';
import { Metric } from '../shared/metric';
import { Dashboard } from './dashboard';

export class Widget {

  public description: string;

  public type: string;
  public metrics: Metric[];
  constructor(
    public id: number, 
    public name: string, 
    public typeId: number, 
    public dashboardId: number,
    public metricIds: string[]
  ) {}
  // json of settings

  get metricsString(): string {
    return this.metricIds.toString();
  }
}
