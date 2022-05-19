import { Threshold } from "@widget/models/threshold";
import { ApiGetMetric, Metric, MetricAdapter } from "@core/models/metric";
import { Adapter } from "@core/models/adapter";
import { ChannelGroup } from "@core/models/channel-group";
import { Injectable } from "@angular/core";

export class Widget {
  public channelGroup: ChannelGroup;
  public thresholds: Threshold[];
  public _layout: WidgetLayout = defaultLayout;
  public _properties: WidgetProperties = defaultProperties;
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public dashboardId: number,
    public channelGroupId: number,
    public metrics: Metric[],
    public type: string
  ) {
    //this will override settings when created
  }

  //can be entered as string or properties
  public set properties(properties: string | Partial<WidgetProperties>) {
    let props: Partial<WidgetProperties>;
    if (!properties) {
      props = defaultProperties;
    } else if (properties && typeof properties === "string") {
      props = { ...JSON.parse(properties) };
    } else if (typeof properties !== "string") {
      props = { ...properties };
    }

    this._properties = { ...props };
  }

  public get properties(): WidgetProperties {
    return this._properties;
  }

  //can be entered as string or properties
  public set layout(layout: string | Partial<WidgetLayout>) {
    let props: Partial<WidgetLayout>;
    if (!layout) {
      props = defaultLayout;
    } else if (layout && typeof layout === "string") {
      props = { ...JSON.parse(layout) };
    } else if (typeof layout !== "string") {
      props = { ...layout };
    }

    this._layout = { ...this._layout, ...props };
  }

  public get layout(): WidgetLayout {
    return this._layout;
  }

  public get isValid(): boolean {
    return (
      this.name &&
      this.name.length > 0 &&
      this.type &&
      this.properties.stat &&
      this.type &&
      this.properties.stat &&
      this.metrics &&
      this.metrics.length > 0
    );
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

const defaultProperties: WidgetProperties = {
  theme: "red",
};

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
  thresholds: string;
  channel_group: number;
  user_id: string;
  properties: string;
  type: string;
  layout: string;
  columns?: number;
  rows?: number;
  x_position: number;
  y_position: number;
  stattype: any;
  widgettype: any;
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
function populateLayout(item: ApiGetWidget): string {
  const layout: WidgetLayout = {
    rows: item.rows,
    columns: item.columns,
    x: item.x_position,
    y: item.y_position,
  };

  return JSON.stringify(layout);
}
function populateProperties(item: ApiGetWidget): string {
  const properties: WidgetProperties = {
    stat: item.stattype?.type,
    useAggregate: item.widgettype?.use_aggregate,
  };

  return JSON.stringify(properties);
}
@Injectable({
  providedIn: "root",
})
export class WidgetAdapter implements Adapter<Widget> {
  constructor(public metricAdapter: MetricAdapter) {}
  adaptFromApi(item: ApiGetWidget): Widget {
    const metrics = [];
    const thresholds = {};

    if (item.metrics) {
      item.metrics.forEach((m) => {
        metrics.push(this.metricAdapter.adaptFromApi(m));
      });
    }

    const type = item.type || item.widgettype?.type;

    const widget = new Widget(
      item.id,
      +item.user_id,
      item.name,
      item.dashboard,
      item.channel_group,
      metrics,
      type
    );

    widget.thresholds = [];

    widget.layout = item.layout || populateLayout(item);
    widget.properties = item.properties || populateProperties(item);
    return widget;
  }

  adaptToApi(item: Widget): ApiPostWidget {
    return {
      name: item.name,
      metrics: item.metricsIds,
      dashboard: item.dashboardId,
      channel_group: item.channelGroupId,
      type: item.type,
      layout: JSON.stringify(item.layout),
      properties: JSON.stringify(item.properties),
    };
  }
}
