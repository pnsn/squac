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
  sum: number;
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

export interface Aggregate {
  /** aggregate value */
  value: number;
  metric: number;
  channel: number;
  sum: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  stdev: number;
  numSamps: number;
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
 * Describes an aggregate
 */
export class Aggregate extends ReadOnlyResourceModel<
  ReadOnlyAggregateSerializer | Aggregate
> {
  /** @returns number of samps */
  get num_samps(): number {
    return this.numSamps;
  }
  /** @returns model name */
  static get modelName(): string {
    return "Aggregate";
  }
}
