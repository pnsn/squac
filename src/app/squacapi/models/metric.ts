import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter.interface";
import { ReadMetric, WriteMetric } from "../interfaces/squac-types";
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
    public sampleRate: number, //seconds
    public minVal?: number,
    public maxVal?: number
  ) {}

  static get modelName() {
    return "Metric";
  }
}

@Injectable({
  providedIn: "root",
})
export class MetricAdapter implements Adapter<Metric> {
  adaptFromApi(item: ReadMetric): Metric {
    return new Metric(
      item.id,
      item.user,
      item.name,
      item.code,
      item.description,
      item.reference_url,
      item.unit,
      item.sample_rate,
      item.default_minval,
      item.default_maxval
    );
  }

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
