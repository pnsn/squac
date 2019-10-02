import { ChannelGroup } from '../shared/channel-group';
import { Metric } from '../shared/metric';
import { Dashboard } from './dashboard';

export class Widget {
  public id: number;
  public name: string;
  public description: string;
  public metrics: Metric[];
  public dashboard: Dashboard;

  constructor(id: number, name: string, metrics: Metric[]) {
    this.id = id;
    this.name = name;
    this.metrics = metrics;
  }
  // json of settings
}
