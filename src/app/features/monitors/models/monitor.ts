import { Injectable } from '@angular/core';
import { Adapter } from '@core/models/adapter';
import { MetricAdapter } from '@core/models/metric';
import { Trigger } from './trigger';

export class Monitor {
  constructor(
    public id: number,
    public name: string,
    public channelGroupId: number,
    public metricId: number,
    public intervalType: string,
    public intervalCount: number,
    public numberChannels: number,
    public stat: string,
    public owner: number,
    public triggers: Trigger[]
  ) {}
}

export interface apiGetMonitor {
  id: number;
  url: string;
  channel_group?: number | any;
  metric?: number | any;
  interval_type: string;
  interval_count?: number;
  num_channels?: number;
  stat: string;
  name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

@Injectable({
  providedIn: "root",
})
export class MonitorAdapter implements Adapter<Monitor> {
  //channelgroup adapter,metric adapter
  constructor(
    private metricAdapter: MetricAdapter
  ) {}
  adapt(item: apiGetMonitor): Monitor {
    return new Monitor(
      item.id,
      item.name,
      item.channel_group,
      item.metric,
      item.interval_type,
      item.interval_count,
      item.num_channels,
      item.stat,
      +item.user_id,
      []
    );
  }
}
