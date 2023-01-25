import { ReadOnlyResourceModel } from "../interfaces";
import {
  Trigger as ApiTrigger,
  ReadOnlyAlertDetailSerializer,
} from "@pnsn/ngx-squacapi-client";

export interface BreachingChannel {
  channel: string;
  channel_id: number;
  min?: number;
  max?: number;
  count?: number;
  sum?: number;
  avg?: number;
}
/**
 * Describes an alert
 */
export class Alert extends ReadOnlyResourceModel<ReadOnlyAlertDetailSerializer> {
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

  override fromRaw(data: ReadOnlyAlertDetailSerializer): void {
    super.fromRaw(data);
    let breachingChannels: BreachingChannel[] = [];

    if (typeof data.breaching_channels === "string") {
      try {
        breachingChannels = JSON.parse(
          data.breaching_channels
        ) as BreachingChannel[];
      } catch {
        breachingChannels = [];
      }
    }
    this.breachingChannels = breachingChannels;
    Object.assign(this, {
      inAlarm: data.in_alarm,
      triggerId: data.trigger,
      monitorId: data.monitor,
      monitorName: data.monitor_name,
      valueOperator: data.value_operator,
      numChannels: data.num_channels,
      numChannelsOperator: data.num_channels_operator,
    });
  }
}
