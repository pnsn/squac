import { Metric } from './metric';
import { Station } from './station';

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
  public stations: Station[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  addMetric(metric: Metric){
    this.metrics.push(metric);
  }

  updateMetrics(metrics: Metric[]) {
    this.metrics = metrics;
  }
}
