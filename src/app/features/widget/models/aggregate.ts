import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";

// Describes an aggregate
export class Aggregate {
  public value: number;
  constructor(
    public metricId: number,
    public channelId: number,
    public min: number,
    public max: number,
    public mean: number,
    public median: number,
    public stdev: number,
    public numSamps: number,
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

  static get modelName() {
    return "Aggregate";
  }
}

export interface ApiGetAggregate {
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

@Injectable({
  providedIn: "root",
})
export class AggregateAdapter implements Adapter<Aggregate> {
  adaptFromApi(item: ApiGetAggregate): Aggregate {
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
