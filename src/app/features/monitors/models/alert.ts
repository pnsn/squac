import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";
import { Monitor } from "./monitor";
import { ApiGetTrigger, Trigger, TriggerAdapter } from "./trigger";

export class Alert {
  constructor(
    public id: number,
    public owner: number,
    public timestamp: string,
    public message: string,
    public inAlarm: boolean,
    public breaching_channels,
    public trigger: Trigger
  ) {}

  monitor: Monitor;

  static get modelName() {
    return "Alert";
  }
}

export interface ApiGetAlert {
  id: number;
  url: string;
  trigger: ApiGetTrigger;
  timestamp: string;
  message: string;
  in_alarm: boolean;
  breaching_channels: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

@Injectable({
  providedIn: "root",
})
export class AlertAdapter implements Adapter<Alert> {
  constructor(private triggerAdapter: TriggerAdapter) {}
  adaptFromApi(item: ApiGetAlert): Alert {
    return new Alert(
      item.id,
      +item.user_id,
      item.timestamp,
      item.message,
      item.in_alarm,
      item.breaching_channels,
      this.triggerAdapter.adaptFromApi(item.trigger)
    );
  }
}
