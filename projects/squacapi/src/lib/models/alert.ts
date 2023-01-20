import { ReadAlert } from "../interfaces";
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

  /**
   *
   *
   * @param item
   * @returns new alert
   */
  static deserialize(item: ReadAlert): Alert {
    const alert = new Alert();

    let breachingChannels: BreachingChannel[] = [];

    if (typeof item.breachingChannels === "string") {
      try {
        breachingChannels = JSON.parse(
          item.breachingChannels
        ) as BreachingChannel[];
      } catch {
        breachingChannels = [];
      }
    }

    Object.assign(alert, item);
    alert.owner = item.user;
    alert.triggerId = item.trigger;
    alert.breachingChannels = breachingChannels;
    alert.monitorId = +item.monitor;

    return alert;
  }
}
