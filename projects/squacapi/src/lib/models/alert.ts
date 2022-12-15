import { Injectable } from "@angular/core";
import { Adapter, ReadAlert } from "../interfaces";
import { Monitor, Trigger } from "../models";
import { TriggerAdapter } from "../models/trigger";

/**
 * Describes an alert
 */
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

  /** @returns model name */
  static get modelName(): string {
    return "Alert";
  }
}

/** Adapt alert */
@Injectable({
  providedIn: "root",
})
export class AlertAdapter implements Adapter<Alert, ReadAlert, unknown> {
  /** @override */
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
