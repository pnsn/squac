import {
  ReadOnlyMonitorDetailSerializer,
  WriteOnlyMonitorSerializer,
} from "@pnsn/ngx-squacapi-client";
import { Alert, Trigger } from ".";
import {
  ApiTrigger,
  ReadMonitor,
  ResourceModel,
  WriteMonitor,
} from "../interfaces";

/**
 * describes a monitor
 */
export class Monitor extends ResourceModel<ReadMonitor, WriteMonitor> {
  name: string;
  channelGroupId: number;
  metricId: number;
  intervalType: ReadOnlyMonitorDetailSerializer.IntervalTypeEnum;
  intervalCount: number;
  stat: ReadOnlyMonitorDetailSerializer.StatEnum;
  owner: number;
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

  fromRaw(data: ReadMonitor): void {
    if ("triggers" in data && data.triggers) {
      this.triggers = data.triggers.map((t: ApiTrigger) =>
        Trigger.deserialize(t)
      );
    }

    this.id = +data.id;
    this.channelGroupId = data.channel_group;
    this.metricId = data.metric;
    this.intervalType = data.interval_type;
    this.intervalCount = data.interval_count;
    this.stat = data.stat;
    this.owner = data.user;

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
