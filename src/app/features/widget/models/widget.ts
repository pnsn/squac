import { Threshold } from "@widget/models/threshold";
import { Metric, MetricAdapter } from "@core/models/metric";
import { Adapter } from "@core/models/adapter";
import { Injectable } from "@angular/core";
import { ApiMetric, ReadWidget, WriteWidget } from "@core/models/squac-types";

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
  rows: 5,
  columns: 10,
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
  reverseColors?: boolean;
  displayType?: string; //worst, channel, stoplight
  numSplits?: number;
  // show_legend: boolean; TODO: add these
  // show_tooltips: boolean;
  // zoom: boolean;
  // sampling: string;
}

@Injectable({
  providedIn: "root",
})
export class WidgetAdapter implements Adapter<Widget> {
  constructor(public metricAdapter: MetricAdapter) {}
  adaptFromApi(item: ReadWidget): Widget {
    let metrics = [];

    if (item.metrics) {
      metrics = item.metrics.map((m: ApiMetric) => {
        metrics.push(this.metricAdapter.adaptFromApi(m));
      });
    }

    const type = item.type;
    const stat = item.stat;
    const widget = new Widget(
      item.id,
      item.user,
      item.name,
      item.dashboard,
      metrics,
      type,
      stat
    );

    widget.thresholds = item.thresholds || [];

    widget.layout = item.layout;
    widget.properties = item.properties;
    return widget;
  }

  adaptToApi(item: Widget): WriteWidget {
    const metrics = new Set(item.metricsIds);
    return {
      name: item.name,
      metrics,
      dashboard: item.dashboardId,
      type: item.type,
      stat: item.stat,
      layout: JSON.stringify(item.layout),
      properties: JSON.stringify(item.properties),
      thresholds: JSON.stringify(item.thresholds),
    };
  }
}
