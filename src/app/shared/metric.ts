// Describes a metric object
export class Metric {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public url: string,
    public unit: string
  ) {
  }
  public threshold = {
    max: 101,
    min: 1
  };
}
