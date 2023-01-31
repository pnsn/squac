import { ResourceModel, Threshold } from "../interfaces";
import { Metric } from ".";
import { WidgetProperties, WidgetLayout } from "../interfaces";

import {
  ReadOnlyWidgetDetailSerializer,
  WriteOnlyWidgetSerializer,
  Metric as ApiMetric,
  ReadOnlyWidgetSerializer,
} from "@pnsn/ngx-squacapi-client";
import { WIDGET_LAYOUT, WIDGET_PROPERTIES } from "../constants";
import { WidgetStatType } from "../types";

export interface Widget {
  name: string;
  dashboardId: number;
  metrics: Metric[];
  stat?: WidgetStatType; //if use aggregate
  type: string;
}
/**
 * Model for a widget
 */
export class Widget extends ResourceModel<
  ReadOnlyWidgetDetailSerializer | ReadOnlyWidgetSerializer | Widget,
  WriteOnlyWidgetSerializer
> {
  private _thresholds: Threshold[];
  private _layout: WidgetLayout;
  private _properties: WidgetProperties;

  constructor(
    model?: ReadOnlyWidgetDetailSerializer | ReadOnlyWidgetSerializer | Widget
  ) {
    super(model);
    if (!this._properties) {
      this._properties = WIDGET_PROPERTIES;
    }
  }
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

  /** @override */
  override fromRaw(
    data: ReadOnlyWidgetDetailSerializer | ReadOnlyWidgetSerializer | Widget
  ): void {
    super.fromRaw(data);
    this.properties = data.properties;
    this.thresholds = data.thresholds;
    this.layout = data.layout;
    if ("dashboard" in data) {
      this.dashboardId = data.dashboard;
      if (data.metrics && Array.isArray(data.metrics)) {
        const metrics: Metric[] = [];

        data.metrics.forEach((m: ApiMetric | number) => {
          if (typeof m !== "number") {
            metrics.push(new Metric(m));
          }
        });
        this.metrics = metrics;
      }
    }
  }

  /** @override */
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
