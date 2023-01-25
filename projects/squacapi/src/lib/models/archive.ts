import { ReadArchive, ReadOnlyResourceModel } from "../interfaces";

/** Describes an archive */
export class Archive extends ReadOnlyResourceModel<ReadArchive> {
  value?: number;
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

  fromRaw(data: ReadArchive): void {
    Object.assign(this, data);
    this.metricId = data.metric;
    this.channelId = data.channel;
  }
}
