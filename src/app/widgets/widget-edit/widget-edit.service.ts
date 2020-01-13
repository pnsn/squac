import { Injectable} from '@angular/core';
import { Widget } from '../widget';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { Metric } from 'src/app/shared/metric';
import { Threshold } from '../threshold';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WidgetEditService {
  private widget: Widget;
  private channelGroup: ChannelGroup;
  private thresholds: { [metricId: number]: Threshold} = {};
  public metrics = new BehaviorSubject<Metric[]>([]);
  public isValid = new Subject<boolean>();

  // default widget dimensions
  rows = 3;
  columns = 6;
  x = 1;
  y = 1;

  updateValidity() {

    if (this.widget) {
      this.isValid.next(
        this.widget.typeId
        && this.widget.channelGroupId
        && this.widget.metrics
        && this.widget.metrics.length > 0
      );
    }

  }

  constructor() {}

  getThresholds() {
    return this.thresholds;
  }

  // FIXME: don't init a widget like this, return the final widget when needed
  setWidget(widget: Widget) {
    if (widget) {
      this.widget = widget;
      this.thresholds = widget.thresholds;
      this.channelGroup = widget.channelGroup;
      this.metrics.next(this.widget.metrics);

    } else {

      this.widget = new Widget(
        null,
        null,
        null,
        null,
        null,
        null,
        this.columns,
        this.rows,
        this.x,
        this.y,
        null
      );
      this.widget.thresholds = {};
      this.channelGroup = null;
    }
    this.updateValidity();
  }

  getChannelGroup() {
    return this.channelGroup;
  }

  getWidget() {
    return this.widget;
  }

  getMetricIds() {
    if (this.widget) {
      return this.widget.metricsIds;
    }

  }

  updateChannelGroup(channelGroup) {
    this.channelGroup = channelGroup;
    this.widget.channelGroupId = channelGroup.id;
    this.updateValidity();
  }

  updateMetrics(metrics) {
    this.widget.metrics = metrics;
    this.metrics.next(this.widget.metrics);
    this.updateValidity();
  }

  updateType(id) {
    this.widget.typeId = id;
    this.updateValidity();
  }

  updateThresholds(thresholds) {
    thresholds.forEach(threshold => {
      this.thresholds[threshold.metric.id] = new Threshold(
        threshold.id,
        this.widget.id,
        threshold.metric.id,
        threshold.min,
        threshold.max
      );
    });
    this.widget.thresholds = this.thresholds;
    this.updateValidity();
  }

  updateWidgetInfo(name: string, description: string, dashboardId: number, statType ) {
    this.widget.name = name;
    this.widget.description = description;
    this.widget.dashboardId = dashboardId;
    this.widget.stattype = statType;
    this.updateValidity();
  }

  // cancel without sacving
  clearWidget() {
    this.widget = null;
  }

}
