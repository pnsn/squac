import { Injectable } from "@angular/core";
import { Adapter, ReadMeasurement } from "../src/lib/interfaces";

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
}

/**
 * adapt measurement
 */
@Injectable({
  providedIn: "root",
})
export class MeasurementAdapter
  implements Adapter<Measurement, ReadMeasurement, unknown>
{
  /** @override */
  adaptFromApi(item: ReadMeasurement): Measurement {
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
