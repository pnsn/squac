import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";
import { ReadMeasurement } from "@core/models/squac-types";

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

  static get modelName() {
    return "Measurement";
  }
}

@Injectable({
  providedIn: "root",
})
export class MeasurementAdapter implements Adapter<Measurement> {
  adaptFromApi(item: ReadMeasurement): Measurement {
    const measurement = new Measurement(
      item.id,
      item.user,
      item.metric,
      item.channel,
      item.value,
      item.starttime,
      item.endtime
    );
    return measurement;
  }
}