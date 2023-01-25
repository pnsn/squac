import { ResourceModel } from "../interfaces";
import {
  ReadOnlyMetricSerializer,
  Metric as ApiMetric,
  WriteOnlyMetricSerializer,
} from "@pnsn/ngx-squacapi-client";

/**
 * Describes a metric object
 */
export class Metric extends ResourceModel<
  ReadOnlyMetricSerializer | ApiMetric,
  WriteOnlyMetricSerializer
> {
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

  override fromRaw(data: ReadOnlyMetricSerializer | ApiMetric): void {
    super.fromRaw(data);

    this.refUrl = data.reference_url;
    this.sampleRate = data.sample_rate;
    this.minVal = data.default_minval;
    this.maxVal = data.default_maxval;
  }
  toJson(): WriteOnlyMetricSerializer {
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
