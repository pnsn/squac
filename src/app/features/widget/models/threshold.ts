import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";

export class Threshold {
  constructor(
    public id: number,
    public owner: number,
    public widgetId: number,
    public metricId: number,
    public min: number,
    public max: number
  ) {}
  static get modelName() {
    return "Threshold";
  }
}

export interface ApiGetThreshold {
  id: number;
  url: string;
  metric: number;
  widget: number;
  minval: number;
  maxval: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ApiPostThreshold {
  metric: number;
  widget: number;
  minval: number;
  maxval: number;
}

@Injectable({
  providedIn: "root",
})
export class ThresholdAdapter implements Adapter<Threshold> {
  adaptFromApi(item: ApiGetThreshold): Threshold {
    return new Threshold(
      item.id,
      +item.user_id,
      item.widget,
      item.metric,
      item.minval,
      item.maxval
    );
  }

  adaptToApi(item: Threshold): ApiPostThreshold {
    return {
      metric: item.metricId,
      widget: item.widgetId,
      minval: item.min,
      maxval: item.max,
    };
  }
}
