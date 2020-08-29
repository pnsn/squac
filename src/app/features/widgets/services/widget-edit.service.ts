import { Injectable} from '@angular/core';
import { Widget } from '@features/widgets/models/widget';
import { ChannelGroup } from '@core/models/channel-group';
import { Metric } from '@core/models/metric';
import { Threshold } from '../models/threshold';
import { BehaviorSubject, Subject, Observable, merge, of } from 'rxjs';
import { WidgetsService } from './widgets.service';
import { ThresholdsService } from './thresholds.service';
import { ViewService } from '@core/services/view.service';
import { tap } from 'rxjs/operators';


// TODO: this whole thing just needs a fixin'
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

  constructor(
    private widgetsService: WidgetsService,
    private thresholdService: ThresholdsService,
    private viewService: ViewService
  ) {}


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
        threshold.owner,
        this.widget.id,
        threshold.metric.id,
        threshold.min !== null ? +threshold.min : null,
        threshold.max !== null ? +threshold.max : null
      );
    });
    console.log('updateThresholds', this.thresholds);
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
    this.thresholds = {};
    this.channelGroup = null;
    this.metrics.next([]);
  }

  saveWidget() : Observable<any>{
    let newWidget;
    return this.widgetsService.updateWidget(
      this.widget
    ).pipe(
      tap (
        response => {
          newWidget = response;
  
          const thresholdObs = this.thresholdService.updateThresholds(
            this.widget.metrics,
            this.widget.thresholds,
            newWidget.id
          );
          let count = 0;
          if (thresholdObs && thresholdObs.length > 0) {
              return merge(...thresholdObs).pipe(
                tap(result =>{
                  count++;
                  if (newWidget && count === thresholdObs.length) {
                    this.viewService.updateWidget(newWidget);
                  }
                })
              )
            } else {
              this.viewService.updateWidget(newWidget);
              return of(newWidget);
            }
        }
      )
    );
  }



}
