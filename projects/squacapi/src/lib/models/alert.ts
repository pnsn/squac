import { ReadAlert, ReadOnlyResourceModel } from "../interfaces";
import { Trigger as ApiTrigger } from "@pnsn/ngx-squacapi-client";

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
export class Alert extends ReadOnlyResourceModel<ReadAlert> {
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

  fromRaw(data: ReadAlert): void {
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

    Object.assign(this, {
      id: data.id,
      owner: data.user,
      timestamp: data.timestamp,
      inAlarm: data.in_alarm,
      breachingChannels,
      triggerId: data.trigger,
      monitorId: data.monitor,
      monitorName: data.monitor_name,
      val1: data.val1,
      val2: data.val2,
      valueOperator: data.value_operator,
      numChannels: data.num_channels,
      numChannelsOperator: data.num_channels_operator,
    });
  }
}
