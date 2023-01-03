import { Injectable } from "@angular/core";
import { Adapter, ReadMetric, WriteMetric } from "../interfaces";

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
}

/**
 * adapts metric
 */
@Injectable({
  providedIn: "root",
})
export class MetricAdapter implements Adapter<Metric, ReadMetric, WriteMetric> {
  /** @override */
  adaptFromApi(item: ReadMetric): Metric {
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

  /** @override */
  adaptToApi(item: Metric): WriteMetric {
    return {
      name: item.name,
      code: item.code,
      description: item.description,
      reference_url: item.refUrl,
      unit: item.unit,
      default_minval: item.minVal,
      default_maxval: item.maxVal,
    };
  }
}
