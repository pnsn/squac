import { ResourceModel, Threshold } from "../interfaces";
import { Metric } from ".";
import {
  ApiMetric,
  ReadWidget,
  WriteWidget,
  WidgetProperties,
  WidgetLayout,
} from "../interfaces";
import { WIDGET_LAYOUT, WIDGET_PROPERTIES } from "../constants";
import { WidgetStatType } from "../types";
import {
  ReadOnlyWidgetDetailSerializer,
  WriteOnlyWidgetSerializer,
} from "@pnsn/ngx-squacapi-client";

/**
 * Model for a widget
 */
export class Widget extends ResourceModel<ReadWidget, WriteWidget> {
  public _thresholds: Threshold[] = [];
  public _layout: WidgetLayout = WIDGET_LAYOUT;
  public _properties: WidgetProperties = WIDGET_PROPERTIES;

  public owner: number;
  public name: string;
  public dashboardId: number;
  public metrics: Metric[];
  public stat?: WidgetStatType; //if use aggregate
  public type: string;

  /**
   * Saves thresholds to widgets
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
   * @returns widget thresholds as array
   */
  public get thresholds(): Threshold[] {
    return this._thresholds.slice();
  }

  /**
   * Stores widget properties
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
   * @returns widget properties
   */
  public get properties(): WidgetProperties {
    return this._properties;
  }

  /**
   * stores widget layout
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
   * @returns widget layout
   */
  public get layout(): WidgetLayout {
    return this._layout;
  }

  /**
   * @returns true if widget is valid (has bare minimum required properties)
   */
  public get isValid(): boolean {
    return !!this.name && !!this.metrics && !!this.type && !!this.stat;
  }

  /**
   * @returns array of metric ids for widget
   */
  get metricsIds(): number[] {
    return this.metrics.map((m) => m.id);
  }

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Widget";
  }

  fromRaw(data: ReadOnlyWidgetDetailSerializer): void {
    Object.assign(this, data);
    this.owner = data.user;
    this.dashboardId = data.dashboard;
    if (data.metrics) {
      this.metrics = data.metrics.map((m: ApiMetric) => Metric.deserialize(m));
    }
  }

  toJson(): WriteOnlyWidgetSerializer {
    return {
      name: this.name,
      metrics: this.metricsIds,
      dashboard: this.dashboardId,
      type: this.type,
      stat: this.stat,
      layout: JSON.stringify(this.layout),
      properties: JSON.stringify(this.properties),
      thresholds: JSON.stringify(this.thresholds),
    };
  }
}
