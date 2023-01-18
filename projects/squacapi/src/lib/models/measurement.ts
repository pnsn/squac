import { ReadMeasurement } from "../interfaces";

/**
 * describes a measurement
 */
export class Measurement {
  constructor(
    public id: number,
    public owner: number,
    public metricId: number,
    public channelId: number,
    public value: number,
    public starttime: string,
    public endtime: string
  ) {}

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Measurement";
  }

  /**
   *
   * @param item
   */
  static deserialize(item: ReadMeasurement): Measurement {
    const measurement = new Measurement(
      item.id ? item.id : 0,
      item.user ? item.user : 0,
      item.metric,
      item.channel,
      item.value,
      item.starttime,
      item.endtime
    );
    return measurement;
  }
}
