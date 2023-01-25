import {
  ReadOnlyMonitorDetailSerializer,
  ReadOnlyMonitorSerializer,
  WriteOnlyMonitorSerializer,
  Trigger as ApiTrigger,
} from "@pnsn/ngx-squacapi-client";
import { Alert, Trigger } from ".";
import { ResourceModel } from "../interfaces";

export interface Monitor {
  name: string;
  channelGroupId: number;
  metricId: number;
  intervalType: ReadOnlyMonitorDetailSerializer.IntervalTypeEnum;
  intervalCount: number;
  stat: ReadOnlyMonitorDetailSerializer.StatEnum;
  triggers: Trigger[];
  channelGroupName: string;
  metricName: string;
  alerts?: Alert[];
  inAlarm?: boolean;
}
/**
 * describes a monitor
 */
export class Monitor extends ResourceModel<
  ReadOnlyMonitorDetailSerializer | ReadOnlyMonitorSerializer | Monitor,
  WriteOnlyMonitorSerializer
> {
  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Monitor";
  }

  override fromRaw(
    data: ReadOnlyMonitorDetailSerializer | ReadOnlyMonitorSerializer | Monitor
  ): void {
    super.fromRaw(data);

    if ("triggers" in data && data.triggers) {
      this.triggers = data.triggers.map(
        (t: ApiTrigger | Trigger) => new Trigger(t)
      );
    }

    if ("channel_group_name" in data) {
      this.channelGroupName = data.channel_group_name;
      this.metricName = data.metric_name;
      this.channelGroupId = data.channel_group;
      this.metricId = data.metric;
      this.intervalType = data.interval_type;
      this.intervalCount = data.interval_count;
    }
  }

  toJson(): WriteOnlyMonitorSerializer {
    return {
      interval_type: this.intervalType,
      interval_count: this.intervalCount,
      channel_group: this.channelGroupId,
      metric: this.metricId,
      stat: this.stat,
      name: this.name,
    };
  }
}
