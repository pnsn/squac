import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";
import { apiGetTrigger, Trigger, TriggerAdapter } from "./trigger";

export class Alert {
  constructor(
    public id: number,
    public owner: number,
    public timestamp: string,
    public message: string,
    public inAlarm: boolean,
    public trigger: Trigger
  ){}
}

export interface apiGetAlert {
  id: number;
  url: string;
  trigger: apiGetTrigger;
  timeStamp?: string;
  message?: string;
  in_alarm: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

@Injectable({
  providedIn: "root",
})
export class AlertAdapter implements Adapter<Alert> {
  constructor(
    private triggerAdapter: TriggerAdapter
  ) {}
  adapt(item: apiGetAlert): Alert {
    return new Alert(
      item.id,
      +item.user_id,
      item.timeStamp,
      item.message,
      item.in_alarm,
      this.triggerAdapter.adapt(item.trigger)
    );
  }
}