import { Injectable } from "@angular/core";
import { Adapter, ReadAlert } from "../interfaces";
import { Trigger as ApiTrigger } from "@pnsn/ngx-squacapi-client";

type BreachingChannel = Record<string, string | number>;
/**
 * Describes an alert
 */
export class Alert {
  id?: number;
  owner?: number;
  timestamp!: string;
  message!: string;
  inAlarm?: boolean;
  breachingChannels!: BreachingChannel[];

  triggerId?: number;
  monitorId: number;
  monitorName: string;
  val1: number;
  val2?: number;
  valueOperator?: ApiTrigger.ValueOperatorEnum;
  numChannels: number;
  numChannelsOperator: ApiTrigger.NumChannelsOperatorEnum;

  /** @returns model name */
  static get modelName(): string {
    return "Alert";
  }

  /** deserializes */
  static deserialize(item: ReadAlert): Alert {
    const alert = new Alert();

    let breachingChannels: BreachingChannel[] = [];

    if (typeof item.breaching_channels === "string") {
      try {
        breachingChannels = JSON.parse(
          item.breaching_channels
        ) as BreachingChannel[];
      } catch {
        breachingChannels = [];
      }
    }

    Object.assign(alert, {
      id: item.id,
      owner: item.user,
      timestamp: item.timestamp,
      inAlarm: item.in_alarm,
      breachingChannels,
      triggerId: item.trigger,
      monitorId: item.monitor,
      monitorName: item.monitor_name,
      val1: item.val1,
      val2: item.val2,
      valueOperator: item.value_operator,
      numChannels: item.num_channels,
      numChannelsOperator: item.num_channels_operator,
    });
    return alert;
  }
}

/** Adapt alert */
@Injectable({
  providedIn: "root",
})
export class AlertAdapter implements Adapter<Alert, ReadAlert, unknown> {
  /** @override */
  adaptFromApi(item: ReadAlert): Alert {
    let breachingChannels: BreachingChannel[] = [];

    if (typeof item.breaching_channels === "string") {
      try {
        breachingChannels = JSON.parse(
          item.breaching_channels
        ) as BreachingChannel[];
      } catch {
        breachingChannels = [];
      }
    }

    const alert: Alert = new Alert();
    Object.assign(alert, {
      id: item.id,
      owner: item.user,
      timestamp: item.timestamp,
      inAlarm: item.in_alarm,
      breachingChannels,
      triggerId: item.trigger,
      monitorId: item.monitor,
      monitorName: item.monitor_name,
      val1: item.val1,
      val2: item.val2,
      valueOperator: item.value_operator,
      numChannels: item.num_channels,
      numChannelsOperator: item.num_channels_operator,
    });

    return alert;
  }
}
