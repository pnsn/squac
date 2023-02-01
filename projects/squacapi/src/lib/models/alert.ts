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

export interface Alert {
  timestamp: string;
  message: string;
  inAlarm: boolean;
  breachingChannels: BreachingChannel[];
  triggerId: number;
  monitorId: number;
  monitorName: string;
  val1: number;
  val2?: number;
  valueOperator: ApiTrigger.ValueOperatorEnum;
  numChannels: number;
  numChannelsOperator: ApiTrigger.NumChannelsOperatorEnum;
}

/**
 * Describes an alert
 */
export class Alert extends ReadOnlyResourceModel<
  ReadOnlyAlertDetailSerializer | Alert
> {
  /** @returns model name */
  static get modelName(): string {
    return "Alert";
  }

  /** @override */
  override fromRaw(data: ReadOnlyAlertDetailSerializer | Alert): void {
    super.fromRaw(data);

    if ("breaching_channels" in data) {
      let breachingChannels: BreachingChannel[] = [];
      this.triggerId = data.trigger;
      this.monitorId = +data.monitor;
      if (typeof data.breaching_channels === "string") {
        try {
          breachingChannels = JSON.parse(
            data.breaching_channels
          ) as BreachingChannel[];
        } catch (e) {
          breachingChannels = [];
        }
      }
      this.breachingChannels = breachingChannels;
    }
  }
}
