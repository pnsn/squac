import { Metric } from './metric';

export class MetricGroup {
  public id: number;
  public name: string;
  public description: string;
  public metrics: Metric[];
  constructor(name: string, description: string, id?: number) {
    this.name = name;
    this.description = description;
    this.id = id;
  }
}
