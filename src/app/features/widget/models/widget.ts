import {
  ApiGetThreshold,
  Threshold,
  ThresholdAdapter,
} from "@widget/models/threshold";
import { ApiGetMetric, Metric, MetricAdapter } from "@core/models/metric";
import { Adapter } from "@core/models/adapter";
import { ChannelGroup } from "@core/models/channel-group";
import { Injectable } from "@angular/core";

export class Widget {
  public channelGroup: ChannelGroup;
  public thresholds: { [metricId: number]: Threshold };
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public dashboardId: number,
    public channelGroupId: number,
    public metrics: Metric[],
    public type: string,
    public layout?: WidgetLayout,
    public properties?: WidgetProperties
  ) {
    if (!this.layout) {
      this.layout = defaultLayout;
    }
    if (!this.properties) {
      this.properties = defaultProperties;
    }
  }

  // get ids from the metrics
  get metricsIds(): number[] {
    const array = [];
    if (this.metrics) {
      this.metrics.forEach((metric) => {
        array.push(metric.id);
      });
    }
    return array;
  }

  get metricsString(): string {
    return this.metricsIds.toString();
  }

  static get modelName() {
    return "Widget";
  }
}

const defaultProperties: WidgetProperties = {};

const defaultLayout: WidgetLayout = {
  rows: 3,
  columns: 6,
};

export interface WidgetLayout {
  rows: number;
  columns: number;
  x?: number;
  y?: number;
}

export interface WidgetProperties {
  //depends on which widgetType
  theme?: string;
  useAggregate?: boolean;
  stat?: string; //if use aggregate
  displayChannel?: string; //worst, first, or aggregate
  displayMetrics?: Array<number>; //order of display
  // show_legend: boolean; TODO: add these
  // show_tooltips: boolean;
  // zoom: boolean;
  // sampling: string;
}

export interface ApiGetWidget {
  id: number;
  name: string;
  dashboard: number;
  metrics: ApiGetMetric[];
  thresholds: ApiGetThreshold[];
  channel_group: number;
  user_id: string;
  properties: string;
  type: string;
  layout: string;
}

export interface ApiPostWidget {
  name: string;
  dashboard: number;
  metrics: number[];
  channel_group: number;
  properties: string;
  layout: string;
  type: string;
}

@Injectable({
  providedIn: "root",
})
export class WidgetAdapter implements Adapter<Widget> {
  constructor(
    public metricAdapter: MetricAdapter,
    public thresholdsAdapter: ThresholdAdapter
  ) {}
  adaptFromApi(item: ApiGetWidget): Widget {
    const metrics = [];
    const thresholds = {};

    if (item.metrics) {
      item.metrics.forEach((m) => {
        metrics.push(this.metricAdapter.adaptFromApi(m));
      });
    }

    if (item.thresholds) {
      item.thresholds.forEach((t) => {
        thresholds[t.metric] = this.thresholdsAdapter.adaptFromApi(t);
      });
    }
    const widget = new Widget(
      item.id,
      +item.user_id,
      item.name,
      item.dashboard,
      item.channel_group,
      metrics,
      item.type,
      item.layout,
      item.properties
    );
    return widget;
  }

  adaptToApi(item: Widget): ApiPostWidget {
    return {
      name: item.name,
      metrics: item.metricsIds,
      dashboard: item.dashboardId,
      channel_group: item.channelGroupId,
      layout: JSON.stringify(item.layout),
      properties: JSON.stringify(item.properties),
    };
  }
}
