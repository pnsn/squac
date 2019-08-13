import { Metric } from './metric';

export class MetricGroup {
  constructor(
    public id: number, 
    public name: string,
    public description: string,
    public metrics: Metric[])
  {

  }
}
