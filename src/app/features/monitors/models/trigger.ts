import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";

export class Trigger {
  constructor(
    public id: number,
    public monitorId: number,
    public bandInclusive: boolean,
    public level: number,
    public owner: number,
    public min?: number,
    public max?: number
  ) {}

}

export interface apiGetTrigger {
  id: number;
  url: string;
  monitor?: number;
  minval: number;
  maxval: number;
  band_inclusive: boolean;
  level: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

@Injectable({
  providedIn: "root",
})
export class TriggerAdapter implements Adapter<Trigger> {
  adapt(item: apiGetTrigger): Trigger {
    return new Trigger(
      item.id,
      item.monitor,
      item.band_inclusive,
      item.level,
      +item.user_id,
      item.minval,
      item.maxval
    );
  }
}