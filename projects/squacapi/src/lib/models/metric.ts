import { ReadMetric, ResourceModel, WriteMetric } from "../interfaces";

/**
 * Describes a metric object
 */
export class Metric extends ResourceModel<ReadMetric, WriteMetric> {
  owner: number;
  name: string;
  code: string;
  description: string;
  refUrl: string;
  unit: string;
  sampleRate: number; //seconds
  minVal?: number | null;
  maxVal?: number | null;

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Metric";
  }

  fromRaw(data: ReadMetric): void {
    Object.assign(this, data);
    this.owner = data.user;
    this.refUrl = data.reference_url;
    this.sampleRate = data.sample_rate;
    this.minVal = data.default_minval;
    this.maxVal = data.default_maxval;
  }
  toJson(): WriteMetric {
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
