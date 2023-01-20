import { ReadArchive } from "../interfaces";

/** Describes an archive */
export class Archive {
  value?: number;
  id?: number;
  metricId!: number;
  channelId!: number;
  min!: number;
  max!: number;
  mean!: number;
  median!: number;
  stdev!: number;
  num_samps!: number;
  minabs?: number;
  maxabs?: number;
  starttime!: string;
  endtime!: string;

  /** @returns model name */
  static get modelName(): string {
    return "Archive";
  }

  /**
   *
   * @param item
   * @returns
   */
  static deserialize(item: ReadArchive): Archive {
    // squacapi openapi thinks min & maxabs are strings
    const id = item.id ? +item.id : undefined;
    const minabs = item.minabs ? +item.minabs : undefined;
    const maxabs = item.maxabs ? +item.maxabs : undefined;

    const archive: Archive = {
      id,
      metricId: item.metric,
      channelId: item.channel,
      min: item.min,
      max: item.max,
      mean: item.mean,
      median: item.median,
      stdev: item.stdev,
      num_samps: item.numSamps,
      minabs,
      maxabs,
      starttime: item.starttime,
      endtime: item.endtime,
    };
    return archive;
  }
}
