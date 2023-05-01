import { ReadOnlyResourceModel } from "../interfaces";
import { MeasurementAggregatedListRequestParams } from "@pnsn/ngx-squacapi-client";

/** Aggregate read serializer */
export interface ReadOnlyAggregateSerializer {
  /** channel id */
  channel: number;
  /** metric id */
  metric: number;
  /** minimum value of measurements */
  min: number;
  /** maximum value of measurements */
  max: number;
  /** mean  value of measurements */
  mean: number;
  /** median value of measurements */
  median: number;
  /** stdev value of measurements */
  stdev: number;
  /** number of measurements */
  num_samps: number;
  /** sum of measurements */
  sum: number;
  /** 5th percentile of measurements */
  p05: number;
  /** 10th percentile of measurements */
  p10: number;
  /** 90th percentile of measurements */
  p90: number;
  /** 95th percentile of measurements */
  p95: number;
  /** minimum of absolute value of measurements */
  minabs: number;
  /** maxium of absolute value of measurements */
  maxabs: number;
  /** most recent value of measurements */
  latest: number;
  /** Start of first measurement */
  starttime: string;
  /** End of last measurement */
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
  /** channel id */
  channel: number;
  /** metric id */
  metric: number;
  /** minimum value of measurements */
  min: number;
  /** maximum value of measurements */
  max: number;
  /** mean  value of measurements */
  mean: number;
  /** median value of measurements */
  median: number;
  /** stdev value of measurements */
  stdev: number;
  /** number of measurements */
  numSamps: number;
  /** sum of measurements */
  sum: number;
  /** 5th percentile of measurements */
  p05: number;
  /** 10th percentile of measurements */
  p10: number;
  /** 90th percentile of measurements */
  p90: number;
  /** 95th percentile of measurements */
  p95: number;
  /** minimum of absolute value of measurements */
  minabs: number;
  /** maxium of absolute value of measurements */
  maxabs: number;
  /** most recent value of measurements */
  latest: number;
  /** Start of first measurement */
  starttime: string;
  /** End of last measurement */
  endtime: string;
}
/**
 * Aggregate is a calculated summary of multiple metrics
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
