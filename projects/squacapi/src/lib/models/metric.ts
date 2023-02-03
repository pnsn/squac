import { ResourceModel } from "../interfaces";
import {
  ReadOnlyMetricSerializer,
  Metric as ApiMetric,
  WriteOnlyMetricSerializer,
} from "@pnsn/ngx-squacapi-client";

export interface Metric {
  name: string;
  code: string;
  description: string;
  referenceUrl: string;
  unit: string;
  sampleRate: number; //seconds
  minVal?: number | null;
  maxVal?: number | null;
}

/**
 * Describes a metric object
 */
export class Metric extends ResourceModel<
  ReadOnlyMetricSerializer | ApiMetric | Metric,
  WriteOnlyMetricSerializer
> {
  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Metric";
  }

  /** @override */
  override fromRaw(data: ReadOnlyMetricSerializer | ApiMetric | Metric): void {
    super.fromRaw(data);

    if ("default_minval" in data || "default_maxval" in data) {
      this.minVal = data.default_minval;
      this.maxVal = data.default_maxval;
    }
  }

  /** @override */
  toJson(): WriteOnlyMetricSerializer {
    return {
      name: this.name,
      code: this.code,
      description: this.description,
      reference_url: this.referenceUrl,
      unit: this.unit,
      default_minval: this.minVal,
      default_maxval: this.maxVal,
    };
  }
}
