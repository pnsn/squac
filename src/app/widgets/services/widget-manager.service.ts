import { Injectable } from "@angular/core";
import {
  ArchiveStatTypes,
  ArchiveTypes,
} from "@squacapi/interfaces/archivetypes";
import { Channel } from "@squacapi/models/channel";
import { Metric } from "@squacapi/models/metric";
import { Threshold } from "@squacapi/models/threshold";
import { Widget, WidgetProperties } from "@squacapi/models/widget";
import { ReplaySubject, Subject } from "rxjs";
import { WidgetStatTypes } from "../interfaces/widget-stattypes";
import { WidgetDisplayOption, WidgetType } from "../interfaces/widget-type";
import { MeasurementParams, WidgetDataService } from "./widget-data.service";
import { WidgetErrors } from "../../features/widget/services/widget-errors";
import { WidgetTypes, WIDGET_TYPE_INFO } from "../interfaces/widget-types";

/**
 * Keeps track of data shared between widget tree components
 * Needs to be provided at WidgetDetail Level
 */
@Injectable()
export class WidgetManagerService {
  constructor(private widgetDataService: WidgetDataService) {}

  widget = new ReplaySubject<Widget>(1);
  errors = new ReplaySubject<WidgetErrors>();
  resize = new Subject<any>();

  // communication between external widget controls and actual widget
  toggleKey = new Subject<boolean>();
  zoomStatus = new Subject<string>();

  private _params: MeasurementParams = {};
  private _channels: Channel[];
  private _group: number; //channel group id
  private _widget: Widget;
  private _widgetType: WidgetTypes;
  private _widgetDisplayOption: WidgetDisplayOption;
  private _selectedMetrics: Metric[];
  private _widgetConfig: WidgetType;

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

  get starttime(): string {
    return this._params.starttime;
  }

  get endtime(): string {
    return this._params.endtime;
  }

  get widgetConfig(): WidgetType {
    return this._widgetConfig;
  }

  get widgetType(): WidgetTypes {
    return this._widgetType;
  }

  set widgetType(widgetType: WidgetTypes) {
    this._widgetType = widgetType;

    this._widgetConfig = WIDGET_TYPE_INFO[this._widgetType].config;
    this._widgetDisplayOption =
      this.widgetConfig.displayOptions[this._widget.properties.displayType];

    if (this._widget.metrics.length === 0) {
      this.errors.next(WidgetErrors.NO_METRICS);
    } else if (this.widgetConfig.minMetrics > this._widget.metrics.length) {
      ///ERROR
      this.errors.next(WidgetErrors.MISSING_METRICS);
    }
    this.widgetDataService.useAggregate = this.widgetConfig.useAggregate;
  }

  initWidget(widget: Widget) {
    if (widget.isValid) {
      this._widget = widget;
      this.widgetType = widget.type as WidgetTypes;

      this.widgetDataService.widget = widget;
      this.widget.next(this._widget);
    } else {
      this.errors.next(WidgetErrors.BAD_CONFIGURATION);
      //emit error
    }
  }

  updateMetrics(metrics: Metric[]) {
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

  updateThresholds(thresholds: Threshold[]) {
    this._widget.thresholds = thresholds;
  }

  updateChannels(group: number, channels: Channel[]) {
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
      this.errors.next(WidgetErrors.NO_CHANNELS);
    }
  }

  updateStat(
    stat: ArchiveStatTypes | WidgetStatTypes | string,
    archiveType: ArchiveTypes
  ) {
    //calculate stat
    this.widgetDataService.stat = stat;
    this.widgetDataService.archiveType = archiveType;
  }

  updateTimes(start, end) {
    this._params.starttime = start;
    this._params.endtime = end;
  }

  fetchData() {
    this.widgetDataService.params.next(this._params);
  }
}
