import {
  ReadOnlyMonitorDetailSerializer,
  ReadOnlyMonitorSerializer,
  WriteOnlyMonitorSerializer,
  Trigger as ApiTrigger,
} from "@pnsn/ngx-squacapi-client";
import { Alert, Trigger } from ".";
import { ResourceModel } from "../interfaces";

// monitors
export type ReadMonitor =
  | ReadOnlyMonitorDetailSerializer
  | ReadOnlyMonitorSerializer;

/**
 * describes a monitor
 */
export class Monitor extends ResourceModel<
  ReadOnlyMonitorDetailSerializer | ReadOnlyMonitorSerializer,
  WriteOnlyMonitorSerializer
> {
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

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Monitor";
  }

  override fromRaw(
    data: ReadOnlyMonitorDetailSerializer | ReadOnlyMonitorSerializer
  ): void {
    super.fromRaw(data);

    if ("triggers" in data && data.triggers) {
      this.triggers = data.triggers.map((t: ApiTrigger) => new Trigger(t));
    }

    this.channelGroupId = data.channel_group;
    this.metricId = data.metric;
    this.intervalType = data.interval_type;
    this.intervalCount = data.interval_count;

    if ("channel_group_name" in data) {
      this.channelGroupName = data.channel_group_name;
    }
    if ("metric_name" in data) {
      this.metricName = data.metric_name;
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
