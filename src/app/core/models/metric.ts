// Describes a metric object
export class Metric {
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public code: string,
    public description: string,
    public refUrl: string,
    public unit: string,
    public sampleRate: number,
    public minVal?: number,
    public maxVal?: number
  ) {
  }


  static get modelName() {
    return 'Metric';
  }
}
