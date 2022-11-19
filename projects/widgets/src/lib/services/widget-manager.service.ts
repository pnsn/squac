import { Injectable } from "@angular/core";
import { ReplaySubject, Subject } from "rxjs";

import { ArchiveStatType, ArchiveType } from "squacapi";
import { Channel, Metric, Widget } from "squacapi";
import {
  MeasurementParams,
  Threshold,
  WidgetProperties,
  WidgetStatType,
} from "squacapi";

import { WidgetErrors, WidgetType } from "../enums";
import { WidgetConfig, WidgetDisplayOption } from "../interfaces";
import { WidgetDataService } from ".";
import { WIDGET_TYPE_INFO } from "../constants";
import { BehaviorSubject } from "rxjs";

/**
 * Keeps track of data shared between widget tree components
 * Needs to be provided at WidgetDetail Level
 */
@Injectable()
export class WidgetManagerService {
  constructor(private widgetDataService: WidgetDataService) {
    this.isLoading$ = widgetDataService.isLoading$;
  }

  isLoading$: BehaviorSubject<boolean>;
  widget$ = new ReplaySubject<Widget>(1);
  errors$ = new ReplaySubject<WidgetErrors>();
  resize$ = new Subject<boolean>();

  // communication between external widget controls and actual widget
  toggleKey$ = new Subject<boolean>();
  zoomStatus$ = new Subject<string>();

  private _params: MeasurementParams = {};
  private _channels: Channel[] = [];
  private _group?: number; //channel group id
  private _widget!: Widget;
  private _widgetType?: WidgetType;
  private _widgetDisplayOption!: WidgetDisplayOption;
  private _selectedMetrics: Metric[] = [];
  private _widgetConfig!: WidgetConfig;

  get channels(): Channel[] {
    return this._channels;
  }

  get selectedMetrics(): Metric[] {
    return this._selectedMetrics;
  }
  get widgetDisplayOption(): WidgetDisplayOption {
    return this._widgetDisplayOption;
  }
  get thresholds(): Threshold[] {
    return this._widget.thresholds;
  }

  get properties(): WidgetProperties {
    return this._widget.properties;
  }

  get starttime(): string | undefined {
    return this._params.starttime;
  }

  get endtime(): string | undefined {
    return this._params.endtime;
  }

  get widgetConfig(): WidgetConfig {
    return this._widgetConfig;
  }

  get widgetType(): WidgetType | undefined {
    return this._widgetType;
  }

  initWidget(widget: Widget): void {
    if (widget.isValid) {
      this._widget = widget;
      this.updateWidgetType(widget.type as WidgetType);

      this.widget$.next(this._widget);
    } else {
      this.errors$.next(WidgetErrors.BAD_CONFIGURATION);
      //emit error
    }
  }

  updateWidgetType(widgetType: WidgetType): void {
    this._widgetType = widgetType;

    this._widgetConfig = WIDGET_TYPE_INFO[this._widgetType].config;

    const displayType =
      this._widget.properties.displayType ?? this._widgetConfig.defaultDisplay;

    if (this.widgetConfig?.displayOptions && displayType) {
      this._widgetDisplayOption = this.widgetConfig.displayOptions[displayType];
    }

    if (this._widget.metrics.length === 0) {
      this.errors$.next(WidgetErrors.NO_METRICS);
    } else if (this.widgetConfig.minMetrics > this._widget.metrics.length) {
      ///ERROR
      this.errors$.next(WidgetErrors.MISSING_METRICS);
    }
    this.widgetDataService.useAggregate =
      this.widgetConfig.useAggregate ?? false;
  }

  updateMetrics(metrics: Metric[]): void {
    //do stuff with metrics
    this._selectedMetrics = metrics;
    if (metrics.length > 0) {
      this._params.metric = metrics.map((m) => m.id);
    } else if (this._widget.metricsIds.length > 0) {
      this._params.metric = this._widget.metricsIds;
    }
    // no metrics error
    this.fetchData();
  }

  updateThresholds(thresholds: Threshold[]): void {
    this._widget.thresholds = thresholds;
  }

  updateChannels(group: number, channels: Channel[]): void {
    if (group !== this._group) {
      //group has changed, use for next request
      delete this._params.channel;
      this._params.group = [group];
    } else {
      this._params.channel = channels.map((c) => c.id);
      delete this._params.group;
    }

    this._group = group;
    this._channels = channels;

    if (this._channels.length === 0) {
      this.errors$.next(WidgetErrors.NO_CHANNELS);
    }
  }

  updateStat(
    stat: ArchiveStatType | WidgetStatType | string,
    archiveType: ArchiveType
  ): void {
    //calculate stat
    this.widgetDataService.stat = stat;
    this.widgetDataService.archiveType = archiveType;
  }

  updateTimes(start: string, end: string): void {
    this._params.starttime = start;
    this._params.endtime = end;
  }

  fetchData(): void {
    this.widgetDataService.params$.next(this._params);
  }
}
