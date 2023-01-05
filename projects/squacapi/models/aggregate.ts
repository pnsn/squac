import { Injectable } from "@angular/core";
import { Adapter, ReadAggregate } from "../src/lib/interfaces";
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
  public value?: number;
  constructor(
    public metricId: number,
    public channelId: number,
    public min: number,
    public max: number,
    public mean: number,
    public median: number,
    public stdev: number,
    public num_samps: number,
    public p05: number,
    public p10: number,
    public p90: number,
    public p95: number,
    public minabs: number,
    public maxabs: number,
    public latest: number,
    public starttime: string,
    public endtime: string
  ) {}

  /** @returns model name */
  static get modelName(): string {
    return "Aggregate";
  }
}

/**
 * Adapt aggregate
 */
@Injectable({
  providedIn: "root",
})
export class AggregateAdapter
  implements Adapter<Aggregate, ReadAggregate, unknown>
{
  /**
   * @override
   */
  adaptFromApi(item: ReadAggregate): Aggregate {
    const aggregate = new Aggregate(
      item.metric,
      item.channel,
      item.min,
      item.max,
      item.mean,
      item.median,
      item.stdev,
      item.num_samps,
      item.p05,
      item.p10,
      item.p90,
      item.p95,
      item.minabs,
      item.maxabs,
      item.latest,
      item.starttime,
      item.endtime
    );
    return aggregate;
  }
}
