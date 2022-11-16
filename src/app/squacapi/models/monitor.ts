import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter.interface";
import {
  // ApiGetChannelGroup,
  ChannelGroup,
  ChannelGroupAdapter,
} from "./channel-group";
import { Metric, MetricAdapter } from "./metric";
import {
  ApiTrigger,
  ReadMonitor,
  WriteMonitor,
} from "../interfaces/squac-types";
import { Alert } from "./alert";
import { Trigger, TriggerAdapter } from "./trigger";
import { ReadOnlyMonitorDetailSerializer } from "@pnsn/ngx-squacapi-client";

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
  adaptFromApi(item: ReadMonitor): Monitor {
    const channelGroupAdapter = new ChannelGroupAdapter();
    const metricAdapter = new MetricAdapter();
    const triggerAdapter = new TriggerAdapter();
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
      channelGroup = channelGroupAdapter.adaptFromApi(item.channel_group);
    }

    if (typeof item.metric === "number") {
      metricId = item.metric;
    } else {
      metricId = item.metric.id;
      metric = metricAdapter.adaptFromApi(item.metric);
    }

    if ("triggers" in item) {
      triggers = item.triggers.map((t: ApiTrigger) =>
        triggerAdapter.adaptFromApi(t)
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
