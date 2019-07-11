import { Metric } from './metric';
import { Station } from './station';

//Wtf does a group look like
export class Group {
  private id: number;
  private name: string;
  private description: string;
  private metrics: Metric[];
  private stations: Station[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  addMetric(metric: Metric){
    this.metrics.push(metric);
  }
}
