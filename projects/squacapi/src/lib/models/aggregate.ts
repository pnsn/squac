import { ReadOnlyResourceModel } from "../interfaces";
import { MeasurementAggregatedListRequestParams } from "@pnsn/ngx-squacapi-client";

/** Read aggregate interface */
export interface ReadOnlyAggregateSerializer {
  channel: number;
  metric: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  stdev: number;
  num_samps: number;
  p05: number;
  p10: number;
  p90: number;
  p95: number;
  minabs: number;
  maxabs: number;
  latest: number;
  starttime: string;
  endtime: string;
}

/**
 * Aggregate list params
 */
export class AggregateListParams
  implements MeasurementAggregatedListRequestParams {}

/**
 * Describes an aggregate
 */
export class Aggregate extends ReadOnlyResourceModel<ReadOnlyAggregateSerializer> {
  /** aggregate value */
  value: number;
  metric: number;
  channel: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  stdev: number;
  num_samps: number;
  p05: number;
  p10: number;
  p90: number;
  p95: number;
  minabs: number;
  maxabs: number;
  latest: number;
  starttime: string;
  endtime: string;

  /** @returns model name */
  static get modelName(): string {
    return "Aggregate";
  }
}
