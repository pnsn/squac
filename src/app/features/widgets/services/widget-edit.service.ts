import { Injectable} from '@angular/core';
import { Widget } from '@features/widgets/models/widget';
import { ChannelGroup } from '@core/models/channel-group';
import { Metric } from '@core/models/metric';
import { Threshold } from '../models/threshold';
import { BehaviorSubject, Subject, Observable, merge, of } from 'rxjs';
import { WidgetsService } from './widgets.service';
import { ThresholdsService } from './thresholds.service';
import { ViewService } from '@core/services/view.service';
import { switchMap, tap } from 'rxjs/operators';
import { ifStmt } from '@angular/compiler/src/output/output_ast';

interface Thresholds {
  [metricId: number]: Threshold;
}

// TODO: this whole thing just needs a fixin'
@Injectable({
  providedIn: 'root'
})
export class WidgetEditService {
  private widget: Widget;
  private channelGroup: ChannelGroup;
  private thresholds: Thresholds = {};
  public selectedMetrics = new BehaviorSubject<Metric[]>([]);
  public isValid = new Subject<boolean>();
  dashboardId: number;
  // default widget dimensions
  rows = 3;
  columns = 6;
  x = 0;
  y = 0;

  constructor(
    private widgetsService: WidgetsService,
    private thresholdService: ThresholdsService,
    private viewService: ViewService
  ) {}


  // Keeps track of widget having all required properties
  updateValidity(): void {
    if (this.widget) {

      const hasName = this.widget.name && this.widget.name.length > 0;
      const hasTypes = this.widget.stattype && this.widget.typeId;
      const hasCg = this.widget.channelGroupId;
      const hasMetrics = this.widget.metrics && this.widget.metrics.length > 0;

      this.isValid.next(
        hasName && hasTypes && hasCg && hasMetrics
      );


    } else {
      this.isValid.next(
        false
        );
    }

  }

  // Returns the current thresholds
  getThresholds(): Thresholds {
    return this.thresholds;
  }


  // FIXME: don't init a widget like this, return the final widget when needed
  setWidget(widget: Widget, dashboardId): void {
    this.dashboardId = dashboardId;
    if (widget) {

      this.widget = widget;
      this.thresholds = widget.thresholds ? widget.thresholds : {};
      this.channelGroup = widget.channelGroup;
      this.selectedMetrics.next(this.widget.metrics);

      // in case of copying widget from other dashboard, must set to new dash
      if (widget.dashboardId !== this.dashboardId) {
        this.widget.id = null;
        this.widget.dashboardId = this.dashboardId;
      }
    } else {

      this.widget = new Widget(
        null,
        null,
        null,
        null,
        null,
        dashboardId,
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

  // Returns the selected channel group
  getChannelGroup(): ChannelGroup {
    return this.channelGroup;
  }


  // Returns the current widet
  getWidget(): Widget {
    return this.widget;
  }

  // Selected metrics ids
  getMetricIds(): void | number[] {
    if (this.widget) {
      return this.widget.metricsIds;
    }

  }

  // Saves new selected group
  updateChannelGroup(channelGroup): void {
    this.channelGroup = channelGroup;
    this.widget.channelGroupId = channelGroup.id;
    this.updateValidity();
  }

  // Update selected metrics
  updateMetrics(metrics): void {
    this.widget.metrics = metrics;
    this.selectedMetrics.next(this.widget.metrics);
    this.updateValidity();
  }

  // Update selected widget type
  updateType(id): void {
    this.widget.typeId = id;
    this.updateValidity();
  }

  // Save the new selected thresholds
  updateThresholds(thresholds: any[]): void {
    thresholds.forEach(threshold => {
      this.thresholds[threshold.metric.id] = new Threshold(
        threshold.id,
        threshold.owner,
        this.widget.id,
        threshold.metric.id,
        threshold.min || threshold.min === 0 ? +threshold.min : null,
        threshold.max || threshold.max === 0 ? +threshold.max : null
      );
    });

    this.widget.thresholds = this.thresholds;
    this.updateValidity();
  }

  // Update the widgets info
  updateWidgetInfo(name: string, description: string, statType ): void {
    this.widget.name = name;
    this.widget.description = description;
    this.widget.stattype = statType;
    this.updateValidity();
  }

  // cancel without sacving
  clearWidget(): void {
    this.widget = null;
    this.thresholds = {};
    this.channelGroup = null;
    this.selectedMetrics.next([]);
  }

  // save widget and thresholds to squac
  saveWidget(): Observable<Widget> {
    let newWidget;
    return this.widgetsService.updateWidget(
      this.widget
    ).pipe(
      switchMap (
        response => {
          newWidget = response;

          // returns observables for saving each thresholds
          const thresholdObs = this.thresholdService.updateThresholds(
            this.widget.metrics,
            this.widget.thresholds,
            newWidget.id
          );
          let count = 0;
          if (thresholdObs && thresholdObs.length > 0) {
              return merge(...thresholdObs).pipe(
                tap(result => {
                  count++;
                  if (newWidget && count === thresholdObs.length) {
                    this.viewService.updateWidget(newWidget.id, newWidget);
                  }
                })
              );
            } else {
              this.viewService.updateWidget(newWidget.id, newWidget);
              return of(newWidget);
            }
        }
      )
    );
  }



}
