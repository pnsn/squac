import { Threshold } from "@widget/models/threshold";
import { ApiGetMetric, Metric, MetricAdapter } from "@core/models/metric";
import { Adapter } from "@core/models/adapter";
import { ChannelGroup } from "@core/models/channel-group";
import { Injectable } from "@angular/core";

export class Widget {
  public _thresholds: Threshold[] = [];
  public _layout: WidgetLayout = defaultLayout;
  public _properties: WidgetProperties = defaultProperties;
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public dashboardId: number,
    public metrics: Metric[],
    public type: string,
    public stat: string //if use aggregate
  ) {
    //this will override settings when created
  }
  public set thresholds(thresholds: string | Array<Threshold>) {
    let props: Threshold[];
    if (!thresholds) {
      props = new Array<Threshold>();
    } else if (thresholds && typeof thresholds === "string") {
      props = JSON.parse(thresholds);
    } else if (typeof thresholds !== "string") {
      props = thresholds;
    }

    this._thresholds = props;
  }

  public get thresholds(): Threshold[] {
    return this._thresholds;
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
    return !!this.name && !!this.metrics && !!this.type && !!this.stat;
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
  dimensions?: any; //order of display
  inRange?: {
    color: string[];
    type: string;
  };
  outOfRange?: {
    color: string[];
    type: string;
  };
  displayType?: string; //worst, channel, stoplight
  numSplits?: number;
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
  user_id: string;
  properties: string;
  type: string;
  stat: string;
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

  properties: string;
  layout: string;
  type: string;
  stat: string;
  thresholds: string;
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
function populateProperties(_item: ApiGetWidget): string {
  const properties: WidgetProperties = {};

  return JSON.stringify(properties);
}
@Injectable({
  providedIn: "root",
})
export class WidgetAdapter implements Adapter<Widget> {
  constructor(public metricAdapter: MetricAdapter) {}
  adaptFromApi(item: ApiGetWidget): Widget {
    const metrics = [];

    if (item.metrics) {
      item.metrics.forEach((m) => {
        metrics.push(this.metricAdapter.adaptFromApi(m));
      });
    }

    const type = item.type || item.widgettype?.type;
    const stat = item.stat || item.stattype?.type;
    const widget = new Widget(
      item.id,
      +item.user_id,
      item.name,
      item.dashboard,
      metrics,
      type,
      stat
    );

    widget.thresholds = item.thresholds || [];

    widget.layout = item.layout || populateLayout(item);
    widget.properties = item.properties || populateProperties(item);
    return widget;
  }

  adaptToApi(item: Widget): ApiPostWidget {
    return {
      name: item.name,
      metrics: item.metricsIds,
      dashboard: item.dashboardId,
      type: item.type,
      stat: item.stat,
      layout: JSON.stringify(item.layout),
      properties: JSON.stringify(item.properties),
      thresholds: JSON.stringify(item.thresholds),
    };
  }
}
