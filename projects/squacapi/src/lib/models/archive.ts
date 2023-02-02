import { ReadOnlyResourceModel } from "../interfaces";
import {
  ReadOnlyArchiveDaySerializer,
  ReadOnlyArchiveHourSerializer,
  ReadOnlyArchiveWeekSerializer,
  ReadOnlyArchiveMonthSerializer,
} from "@pnsn/ngx-squacapi-client";

export interface Archive {
  value: number;
  metric: number;
  channel: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  sum: number;
  stdev: number;
  numSamps: number;
  p05: number;
  p10: number;
  p90: number;
  p95: number;
  minabs: number;
  maxabs: number;
  starttime: string;
  endtime: string;
}

/** Describes an archive */
export class Archive extends ReadOnlyResourceModel<
  | ReadOnlyArchiveDaySerializer
  | ReadOnlyArchiveHourSerializer
  | ReadOnlyArchiveWeekSerializer
  | ReadOnlyArchiveMonthSerializer
  | Archive
> {
  /** @returns number of samps */
  get num_samps(): number {
    return this.numSamps;
  }

  /** @returns model name */
  static get modelName(): string {
    return "Archive";
  }
}
