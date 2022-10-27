import { Injectable } from "@angular/core";
import { Channel } from "@squacapi/models/channel";
import { Metric } from "@squacapi/models/metric";
import { Threshold } from "@squacapi/models/threshold";
import { Widget, WidgetProperties } from "@squacapi/models/widget";
import { ReplaySubject, Subject } from "rxjs";
import { WidgetDisplayOption, WidgetType } from "../models/widget-type";
import { MeasurementParams, WidgetDataService } from "./widget-data.service";

/**
 * Keeps track of data shared between widget tree components
 * Needs to be provided at WidgetDetail Level
 */
@Injectable()
export class WidgetManagerService {
  constructor(private widgetDataService: WidgetDataService) {}

  widget = new ReplaySubject(1);
  errors = new Subject();
  toggleKey = new Subject<boolean>();
  zoomStatus = new Subject<string>();
  private _params: MeasurementParams = {};
  private _channels: Channel[];
  private _group: number; //channel group id
  private _widget: Widget;
  private _widgetType: WidgetType;
  private _widgetDisplayOption: WidgetDisplayOption;
  private _selectedMetrics: Metric[];

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

  get widgetType(): WidgetType {
    return this._widgetType;
  }

  set widgetType(widgetType: WidgetType) {
    this._widgetType = widgetType;

    this._widgetDisplayOption = this._widgetType.getOption(
      this._widget.properties.displayType
    );

    if (widgetType.minMetrics > this._widget.metrics.length) {
      ///ERROR
    }
    this.widgetDataService.useAggregate = widgetType.useAggregate;
  }

  initWidget(widget: Widget) {
    if (widget.isValid) {
      this._widget = widget;
      this.widgetDataService.widget = widget;
    } else {
      //emit error
    }
    console.log("Widget init", widget);
    this.widget.next(this._widget);
  }

  updateMetrics(metrics: Metric[]) {
    //do stuff with metrics
    this._selectedMetrics = metrics;
    if (metrics.length > 0) {
      this._params.metric = metrics.map((m) => m.id);
    } else {
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
      this.errors.next("No channels selected.");
      //no channels error
      console.log("errors");
    }
    this.fetchData();
  }

  updateStat(stat: string, archiveType) {
    //calculate stat
    this.widgetDataService.stat = stat;
    this.widgetDataService.archiveType = archiveType;
  }

  updateTimes(start, end) {
    this._params.starttime = start;
    this._params.endtime = end;
    this.fetchData();
  }

  fetchData() {
    this.widgetDataService.params.next(this._params);
  }

  //zooming
  //togglekey

  //selected metrics

  //loading status?
  //data
  // errors
}
