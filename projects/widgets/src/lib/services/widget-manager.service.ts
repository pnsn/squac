import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, Subject } from "rxjs";

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

/**
 * Keeps track of data shared between widget tree components
 * Needs to be provided at WidgetDetail Level
 *
 * The intent for this class was to have a service independent
 * from view controls to manage settings and data for widgets, but there's
 * some redundancies between places storing data that should be reduced
 */
@Injectable()
export class WidgetManagerService {
  constructor(private widgetDataService: WidgetDataService) {
    this.isLoading$ = this.widgetDataService.isLoading$?.asObservable();
  }

  isLoading$: Observable<boolean>;
  widget$ = new ReplaySubject<Widget>(1);
  errors$ = new ReplaySubject<WidgetErrors>();
  resize$ = new Subject<boolean>();

  // communication between external widget controls and actual widget
  toggleKey$ = new ReplaySubject<boolean>(1);
  zoomStatus$ = new Subject<string>();

  private _params: MeasurementParams = {
    order: "starttime",
  };
  private _channels: Channel[] = [];
  private _group?: number; //channel group id
  private _widget!: Widget;
  private _widgetType?: WidgetType;
  private _widgetDisplayOption!: WidgetDisplayOption;
  private _selectedMetrics: Metric[] = [];
  private _widgetConfig!: WidgetConfig;

  /** @returns selected channels */
  get channels(): Channel[] {
    return this._channels;
  }

  /** @returns selected metrics */
  get selectedMetrics(): Metric[] {
    return this._selectedMetrics;
  }

  /** @returns widget display option */
  get widgetDisplayOption(): WidgetDisplayOption {
    return this._widgetDisplayOption;
  }

  /** @returns widget thresholds */
  get thresholds(): Threshold[] {
    return this._widget.thresholds;
  }

  /** @returns widget properties */
  get properties(): WidgetProperties {
    return this._widget.properties;
  }

  /** @returns starttime or undefined */
  get starttime(): string | undefined {
    return this._params.starttime;
  }

  /** @returns endtime or undefined */
  get endtime(): string | undefined {
    return this._params.endtime;
  }

  /** @returns widget config or undefined */
  get widgetConfig(): WidgetConfig {
    return this._widgetConfig;
  }

  /** @returns widget type or undefined */
  get widgetType(): WidgetType | undefined {
    return this._widgetType;
  }

  /** @returns widget stat */
  get stat(): WidgetStatType {
    return this._widget.stat;
  }

  /**
   * Initializes widget and checks if it is valid.
   *
   * @param widget - widget to save
   */
  initWidget(widget: Widget): void {
    if (widget.isValid) {
      this._widget = widget;
      this.updateWidgetType(widget.type as WidgetType);

      // send widget
      this.widget$.next(this._widget);
    } else {
      //emit error
      this.errors$.next(WidgetErrors.BAD_CONFIGURATION);
    }
  }

  /**
   * updates widget properties and config based on widget type
   *
   * @param widgetType - type of set widget
   */
  updateWidgetType(widgetType: WidgetType): void {
    this._widgetType = widgetType;

    this._widgetConfig = WIDGET_TYPE_INFO[this._widgetType].config;

    const displayType =
      this._widget.properties.displayType ?? this._widgetConfig.defaultDisplay;

    const showKey = this._widget.properties?.showLegend ?? true;
    this.toggleKey$.next(showKey);

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

  /**
   * Stores metrics and triggers request for data
   *
   * @param metrics - array of metrics to request
   */
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

  /**
   * Stores widget thresholds
   *
   * @param thresholds widget thresholds
   */
  updateThresholds(thresholds: Threshold[]): void {
    this._widget.thresholds = thresholds;
  }

  /**
   * Updates channels and group in params
   *
   * @param group - id of channel group
   * @param channels - array of channels
   */
  updateChannels(group: number, channels: Channel[]): void {
    if (!group || (group === this._group && channels.length < 2000)) {
      //for less that 2000 channels request using id
      this._params.channel = channels.map((c) => c.id);
      delete this._params.group;
    } else {
      delete this._params.channel;
      this._params.group = [group];
    }

    this._group = group;
    this._channels = channels;
    if (this._channels.length === 0) {
      this.errors$.next(WidgetErrors.NO_CHANNELS);
    }
  }

  /**
   * Stores stat and archive type
   *
   * @param stat - stat type
   * @param archiveType - archive or datat type
   */
  updateStat(
    stat: ArchiveStatType | WidgetStatType | string,
    archiveType: ArchiveType
  ): void {
    //calculate stat
    this.widgetDataService.stat = stat;
    this.widgetDataService.archiveType = archiveType;
  }

  /**
   * Stores start and end time
   *
   * @param start - starttime string
   * @param end - endtime string
   */
  updateTimes(start: string, end: string): void {
    this._params.starttime = start;
    this._params.endtime = end;
  }

  /**
   * Send request to data service with updated params
   */
  fetchData(): void {
    this.widgetDataService.params$.next(this._params);
  }
}
