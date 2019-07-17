import { Metric } from './metric';
import { Channel } from './channel';

//Wtf does a group look like
export class Group {
  public id: number;
  public name: string;
  public description: string;
  public metrics: Metric[] = [
    new Metric(11, "metric 1"),
    new Metric(12, "metric 2"),
    new Metric(13, "metric 3")
  ];
  public stations: Channel[];

  constructor(id: number, name: string, metrics?: Metric[]) {
    this.id = id;
    this.name = name;
    this.metrics = metrics;
  }

  addMetric(metric: Metric){
    this.metrics.push(metric);
  }

  updateMetrics(metrics: Metric[]) {
    this.metrics = metrics;
  }
}
