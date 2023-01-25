import { ReadMeasurement, ReadOnlyResourceModel } from "../interfaces";

/**
 * describes a measurement
 */
export class Measurement extends ReadOnlyResourceModel<ReadMeasurement> {
  owner: number;
  metricId: number;
  channelId: number;
  value: number;
  starttime: string;
  endtime: string;

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Measurement";
  }

  fromRaw(data: ReadMeasurement): void {
    Object.assign(this, {
      id: data.id,
      owner: data.user,
      metricId: data.metric,
      channelId: data.channel,
      value: data.value,
      starttime: data.starttime,
      endtime: data.endtime,
    });
  }
}
