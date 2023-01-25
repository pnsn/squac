import { ReadAggregate, ReadOnlyResourceModel } from "../interfaces";
import { MeasurementAggregatedListRequestParams } from "@pnsn/ngx-squacapi-client";

/**
 * Aggregate list params
 */
export class AggregateListParams
  implements MeasurementAggregatedListRequestParams {}

/**
 * Describes an aggregate
 */
export class Aggregate extends ReadOnlyResourceModel<ReadAggregate> {
  /** aggregate value */
  value: number;
  metricId: number;
  channelId: number;
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

  /**
   * Applies properties from item to aggregate
   *
   * @param item
   */
  fromRaw(item: ReadAggregate): void {
    Object.apply(this, item);
    this.metricId = item.metric;
    this.channelId = item.channel;
  }
}
