import { Injectable } from "@angular/core";
import { Adapter, ReadMeasurement } from "../interfaces";

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

  static get modelName(): string {
    return "Measurement";
  }
}

@Injectable({
  providedIn: "root",
})
export class MeasurementAdapter
  implements Adapter<Measurement, ReadMeasurement, unknown>
{
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
