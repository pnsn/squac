// Describes a metric object
export class Metric {
  constructor(
    public id: number,
    public name: string, 
    public description: string,
    public source: string,
    public unit: string
  ) {
  }
}
