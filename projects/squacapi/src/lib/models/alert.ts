import { Injectable } from "@angular/core";
import { Adapter, ReadAlert } from "../interfaces";
import { Monitor, Trigger } from "../models";
import { TriggerAdapter } from "../models/trigger";

export class Alert {
  id?: number;
  owner?: number;
  timestamp!: string;
  message!: string;
  inAlarm?: boolean;
  breachingChannels!: string[];
  triggerId?: number;

  monitor?: Monitor;
  trigger?: Trigger;

  static get modelName(): string {
    return "Alert";
  }
}

@Injectable({
  providedIn: "root",
})
export class AlertAdapter implements Adapter<Alert, ReadAlert, unknown> {
  adaptFromApi(item: ReadAlert): Alert {
    const triggerAdapter = new TriggerAdapter();
    let breachingChannels: string[] = [];
    let trigger;
    let triggerId;

    if (typeof item.breaching_channels === "string") {
      try {
        breachingChannels = JSON.parse(item.breaching_channels) as string[];
      } catch {
        breachingChannels = [];
      }
    }

    if (typeof item.trigger === "number") {
      triggerId = item.trigger;
    } else if (item.trigger) {
      triggerId = item.trigger.id;
      trigger = triggerAdapter.adaptFromApi(item.trigger);
    }

    const alert: Alert = {
      id: item.id,
      owner: item.user,
      timestamp: item.timestamp,
      message: item.message,
      inAlarm: item.in_alarm,
      breachingChannels,
      triggerId,
      trigger,
    };

    return alert;
  }
}
