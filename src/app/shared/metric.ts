import { Threshold } from '../widgets/threshold';

// Describes a metric object
export class Metric {
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public code: string,
    public description: string,
    public url: string,
    public refUrl: string,
    public unit: string,
    public minVal?: number,
    public maxVal?: number
  ) {
  }
}
