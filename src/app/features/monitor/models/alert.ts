import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";
import { Monitor } from "./monitor";
import { Trigger, TriggerAdapter } from "./trigger";
import { ReadAlert } from "@core/models/squac-types";

export class Alert {
  constructor(
    public id: number,
    public owner: number,
    public timestamp: string,
    public message: string,
    public inAlarm: boolean,
    public breachingChannels: Array<any>,
    public triggerId: number
  ) {}

  monitor: Monitor;
  trigger: Trigger;

  static get modelName() {
    return "Alert";
  }
}

@Injectable({
  providedIn: "root",
})
export class AlertAdapter implements Adapter<Alert> {
  constructor(private triggerAdapter: TriggerAdapter) {}
  adaptFromApi(item: ReadAlert): Alert {
    let breachingChannels;
    let trigger;
    let triggerId;
    if (typeof item.breaching_channels === "string") {
      breachingChannels = JSON.parse(item.breaching_channels) || [];
    }
    if (typeof item.trigger === "number") {
      triggerId = item.trigger;
    } else {
      triggerId = item.trigger.id;
      trigger = this.triggerAdapter.adaptFromApi(item.trigger);
    }

    const alert = new Alert(
      item.id,
      item.user,
      item.timestamp,
      item.message,
      item.in_alarm,
      breachingChannels,
      triggerId
    );

    alert.trigger = trigger;

    return alert;
  }
}
