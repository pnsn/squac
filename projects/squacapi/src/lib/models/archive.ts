import { ReadOnlyResourceModel } from "../interfaces";
import {
  ReadOnlyArchiveDaySerializer,
  ReadOnlyArchiveHourSerializer,
  ReadOnlyArchiveWeekSerializer,
  ReadOnlyArchiveMonthSerializer,
} from "@pnsn/ngx-squacapi-client";

/** Describes an archive */
export class Archive extends ReadOnlyResourceModel<
  | ReadOnlyArchiveDaySerializer
  | ReadOnlyArchiveHourSerializer
  | ReadOnlyArchiveWeekSerializer
  | ReadOnlyArchiveMonthSerializer
> {
  value: number;
  metric: number;
  channel: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  stdev: number;
  num_samps: number;
  minabs: number;
  maxabs: number;
  starttime: string;
  endtime: string;

  /** @returns model name */
  static get modelName(): string {
    return "Archive";
  }
}
