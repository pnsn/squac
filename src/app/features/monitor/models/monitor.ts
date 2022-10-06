import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";
import {
  // ApiGetChannelGroup,
  ChannelGroup,
  ChannelGroupAdapter,
} from "@core/models/channel-group";
import { Metric, MetricAdapter } from "@core/models/metric";
import {
  ApiTrigger,
  ReadMonitor,
  ReadOnlyMonitorDetailSerializer,
  WriteMonitor,
} from "@core/models/squac-types";
import { Alert } from "./alert";
import { Trigger, TriggerAdapter } from "./trigger";

export class Monitor {
  constructor(
    public id: number,
    public name: string,
    public channelGroupId: number,
    public metricId: number,
    public intervalType: ReadOnlyMonitorDetailSerializer.IntervalTypeEnum,
    public intervalCount: number,
    public stat: ReadOnlyMonitorDetailSerializer.StatEnum,
    public owner: number,
    public triggers: Trigger[]
  ) {}

  channelGroup: ChannelGroup;
  metric: Metric;
  alerts: Alert[];
  inAlarm: boolean;
  static get modelName() {
    return "Monitor";
  }
}

@Injectable({
  providedIn: "root",
})
export class MonitorAdapter implements Adapter<Monitor> {
  // channelgroup adapter,metric adapter
  constructor(
    private metricAdapter: MetricAdapter,
    private channelGroupAdapter: ChannelGroupAdapter,
    private triggerAdapter: TriggerAdapter
  ) {}
  adaptFromApi(item: ReadMonitor): Monitor {
    let channelGroupId;
    let metricId;
    let channelGroup: ChannelGroup;
    let metric: Metric;
    let triggers: Trigger[];
    // sometimes API returns number, sometimes group
    if (typeof item.channel_group === "number") {
      channelGroupId = item.channel_group;
    } else {
      channelGroupId = item.channel_group.id;
      channelGroup = this.channelGroupAdapter.adaptFromApi(item.channel_group);
    }

    if (typeof item.metric === "number") {
      metricId = item.metric;
    } else {
      metricId = item.metric.id;
      metric = this.metricAdapter.adaptFromApi(item.metric);
    }

    if ("triggers" in item) {
      triggers = item.triggers.map((t: ApiTrigger) =>
        this.triggerAdapter.adaptFromApi(t)
      );
    }

    const monitor = new Monitor(
      item.id,
      item.name,
      channelGroupId,
      metricId,
      item.interval_type,
      item.interval_count,
      item.stat,
      item.user,
      triggers
    );

    monitor.channelGroup = channelGroup;
    monitor.metric = metric;

    return monitor;
  }

  adaptToApi(item: Monitor): WriteMonitor {
    return {
      interval_type: item.intervalType,
      interval_count: item.intervalCount,
      channel_group: item.channelGroupId,
      metric: item.metricId,
      stat: item.stat,
      name: item.name,
    };
  }
}
