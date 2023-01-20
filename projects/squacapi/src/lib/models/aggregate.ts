import { ReadAggregate } from "../interfaces";
import { MeasurementAggregatedListRequestParams } from "@pnsn/ngx-squacapi-client";

/**
 * Aggregate list params
 */
export class AggregateListParams
  implements MeasurementAggregatedListRequestParams {}

/**
 * Describes an aggregate
 */
export class Aggregate {
  /** aggregate id */
  id?: number;
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
   * @param item
   * @returns new aggregate
   */
  static deserialize(item: ReadAggregate): Aggregate {
    const aggregate = new Aggregate();

    Object.apply(aggregate, item);
    aggregate.metricId = item.metric;
    aggregate.channelId = item.channel;
    return aggregate;
  }
}
