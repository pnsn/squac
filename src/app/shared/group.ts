import { MetricGroup } from './metric-group';
import { Channel } from './channel';

//Wtf does a group look like
export class Group {
  public id: number;
  public name: string;
  public description: string;
  public metricGroups: MetricGroup[] = [
    new MetricGroup(11, "metric 1"),
    new MetricGroup(12, "metric 2"),
    new MetricGroup(13, "metric 3")
  ];
  public stations: Channel[];

  constructor(id: number, name: string, metricGroups?: MetricGroup[]) {
    this.id = id;
    this.name = name;
    this.metricGroups = metricGroups;
  }

  addMetricGroup(metricGroup: MetricGroup){
    this.metricGroups.push(metricGroup);
  }

  updateMetricGroups(metricGroups: MetricGroup[]) {
    this.metricGroups = metricGroups;
  }
}
