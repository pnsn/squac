import { ReadMetric, WriteMetric } from "../interfaces";

/**
 * Describes a metric object
 */
export class Metric {
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public code: string,
    public description: string,
    public refUrl: string,
    public unit: string,
    public sampleRate: number, //seconds
    public minVal?: number | null,
    public maxVal?: number | null
  ) {}

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Metric";
  }

  /**
   *
   * @param item
   */
  static deserialize(item: ReadMetric): Metric {
    return new Metric(
      item.id ? +item.id : 0,
      item.user ? +item.user : 0,
      item.name,
      item.code,
      item.description ?? "",
      item.reference_url,
      item.unit,
      item.sample_rate ?? 0,
      item.default_minval,
      item.default_maxval
    );
  }

  /**
   *
   */
  serialize(): WriteMetric {
    return {
      name: this.name,
      code: this.code,
      description: this.description,
      reference_url: this.refUrl,
      unit: this.unit,
      default_minval: this.minVal,
      default_maxval: this.maxVal,
    };
  }
}
