import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";

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

export interface ApiGetMeasurement {
  channel: number;
  metric: number;
  id: number;
  user_id: string;
  value: number;
  starttime: string;
  endtime: string;
  created_at: string;
}

@Injectable({
  providedIn: "root",
})
export class MeasurementAdapter implements Adapter<Measurement> {
  adaptFromApi(item: ApiGetMeasurement): Measurement {
    const measurement = new Measurement(
      item.id,
      +item.user_id,
      item.metric,
      item.channel,
      item.value,
      item.starttime,
      item.endtime
    );
    return measurement;
  }
}
