import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

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
    public maxVal?: number,
    public comparator?: () => void,
  ) {
  }
}

export interface ApiGetMetric {
  id: number;
  name: string;
  code: string;
  url: string;
  description: string;
  unit: string;
  created_at: string;
  updated_at: string;
  default_minval: number;
  default_maxval: number;
  user_id: string;
  reference_url: string;
  sample_rate: number;
}

export interface ApiPostMetric {
  name: string;
  code: string;
  description: string;
  unit: string;
  reference_url: string;
  default_minval: number;
  default_maxval: number;
}

@Injectable({
  providedIn: 'root',
})
export class MetricAdapter implements Adapter<Metric> {
  adaptFromApi(item: ApiGetMetric): Metric {
    return new Metric(
      item.id,
      +item.user_id,
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

  adaptToApi( item: Metric): ApiPostMetric {
    return {
      name: item.name,
      code: item.code,
      description: item.description,
      reference_url: item.refUrl,
      unit : item.unit,
      default_minval : item.minVal,
      default_maxval : item.maxVal
    };
  }
}
