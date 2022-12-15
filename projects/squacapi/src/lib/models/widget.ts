import { Injectable } from "@angular/core";
import { Threshold } from "../interfaces";
import { Metric, MetricAdapter } from "../models";
import {
  Adapter,
  ApiMetric,
  ReadWidget,
  WriteWidget,
  WidgetProperties,
  WidgetLayout,
} from "../interfaces";
import { WIDGET_LAYOUT, WIDGET_PROPERTIES } from "../constants";
import { WidgetStatType } from "../types";

/**
 * Model for a widget
 */
export class Widget {
  public _thresholds: Threshold[] = [];
  public _layout: WidgetLayout = WIDGET_LAYOUT;
  public _properties: WidgetProperties = WIDGET_PROPERTIES;
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public dashboardId: number,
    public metrics: Metric[],
    public stat?: WidgetStatType //if use aggregate
  ) {
    //this will override settings when created
  }

  public type: string;
  /**
   *
   */
  public set thresholds(thresholds: string | Array<Threshold>) {
    let props: Threshold[] = [];
    if (!thresholds) {
      props = new Array<Threshold>();
    } else if (thresholds && typeof thresholds === "string") {
      try {
        props = [...(JSON.parse(thresholds) as Threshold[])];
      } catch {
        props = [];
      }
    } else if (typeof thresholds !== "string") {
      props = thresholds.slice();
    }

    this._thresholds = props.slice();
  }

  /**
   *
   */
  public get thresholds(): Threshold[] {
    return this._thresholds.slice();
  }
  //can be entered as string or properties
  /**
   *
   */
  public set properties(properties: string | Partial<WidgetProperties>) {
    let props: Partial<WidgetProperties> = {};
    if (!properties) {
      props = WIDGET_PROPERTIES;
    } else if (properties && typeof properties === "string") {
      props = { ...(JSON.parse(properties) as WidgetProperties) };
    } else if (typeof properties !== "string") {
      props = { ...properties };
    }
    this._properties = { ...props };
  }

  /**
   *
   */
  public get properties(): WidgetProperties {
    return this._properties;
  }

  //can be entered as string or properties
  /**
   *
   */
  public set layout(layout: string | Partial<WidgetLayout> | undefined) {
    let props: Partial<WidgetLayout> = {};
    if (!layout) {
      props = WIDGET_LAYOUT;
    } else if (layout && typeof layout === "string") {
      props = { ...(JSON.parse(layout) as WidgetLayout) };
    } else if (typeof layout !== "string") {
      props = { ...layout };
    }

    this._layout = { ...this._layout, ...props };
  }

  /**
   *
   */
  public get layout(): WidgetLayout {
    return this._layout;
  }

  /**
   *
   */
  public get isValid(): boolean {
    return !!this.name && !!this.metrics && !!this.type && !!this.stat;
  }

  // get ids from the metrics
  /**
   *
   */
  get metricsIds(): number[] {
    return this.metrics.map((m) => m.id);
  }

  /**
   *
   */
  static get modelName(): string {
    return "Widget";
  }
}

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class WidgetAdapter implements Adapter<Widget, ReadWidget, WriteWidget> {
  /**
   *
   * @param item
   */
  adaptFromApi(item: ReadWidget): Widget {
    const metricAdapter = new MetricAdapter();
    let metrics: Metric[] = [];

    if (item.metrics) {
      metrics = item.metrics.map((m: ApiMetric) =>
        metricAdapter.adaptFromApi(m)
      );
    }

    const stat = item.stat as WidgetStatType;
    const widget = new Widget(
      item.id,
      item.user,
      item.name,
      item.dashboard,
      metrics,
      stat
    );

    widget.type = item.type;
    widget.thresholds = item.thresholds || [];

    widget.layout = item.layout;
    widget.properties = item.properties;
    return widget;
  }

  /**
   *
   * @param item
   */
  adaptToApi(item: Widget): WriteWidget {
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
