import { Injectable } from "@angular/core";
import { Widget } from "@widget/models/widget";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { Threshold } from "../models/threshold";
import { BehaviorSubject, Subject, Observable, merge, of } from "rxjs";
import { WidgetService } from "./widget.service";
import { ThresholdService } from "./threshold.service";
import { ViewService } from "@core/services/view.service";
import { switchMap, tap } from "rxjs/operators";

// TODO: this whole thing just needs a fixin'
@Injectable({
  providedIn: "root",
})
export class WidgetEditService {
  private _widget: Widget;
  public selectedMetrics = new BehaviorSubject<Metric[]>([]);
  public isValid = new Subject<boolean>();
  dashboardId: number;

  constructor(
    private widgetService: WidgetService,
    private thresholdService: ThresholdService,
    private viewService: ViewService
  ) {}

  get thresholds(): Threshold[] {
    return this.widget?.thresholds;
  }
  get channelGroup(): ChannelGroup {
    return this.widget?.channelGroup;
  }

  // Keeps track of widget having all required properties
  updateValidity(): void {
    if (this.widget) {
      const hasName = this.widget.name && this.widget.name.length > 0;
      const hasTypes = !!this.widget.type;
      const hasCg = this.widget.channelGroupId;
      const hasMetrics = this.widget.metrics && this.widget.metrics.length > 0;

      this.isValid.next(hasName && hasTypes && hasCg && hasMetrics);
    } else {
      this.isValid.next(false);
    }
  }

  // FIXME: don't init a widget like this, return the final widget when needed
  setWidget(widget: Widget, dashboardId: number): void {
    this.dashboardId = dashboardId;
    if (widget) {
      this.widget = widget;
      this.selectedMetrics.next(this.widget.metrics);
      // in case of copying widget from other dashboard, must set to new dash
      if (widget.dashboardId !== this.dashboardId) {
        this.widget.id = null;
        this.widget.dashboardId = this.dashboardId;
      }
    } else {
      this.widget = new Widget(null, null, null, dashboardId, null, [], "");
    }
    this.updateValidity();
  }

  // Returns the current widet
  get widget(): Widget {
    return this._widget;
  }

  public set widget(widget: Widget) {
    this._widget = widget;
  }

  // Selected metrics ids
  get metricIds(): void | number[] {
    return this.widget?.metricsIds;
  }

  // Saves new selected group
  updateChannelGroup(channelGroup: ChannelGroup): void {
    this.widget.channelGroupId = channelGroup.id;
    this.updateValidity();
  }

  // Update selected metrics
  updateMetrics(metrics: Metric[]): void {
    this.widget.metrics = metrics;
    this.selectedMetrics.next(this.widget.metrics);
    this.updateValidity();
  }

  // Update selected widget type
  updateType(type: string): void {
    this.widget.type = type;
    this.updateValidity();
  }

  // Save the new selected thresholds
  updateThresholds(thresholds: any[]): void {
    this.widget.thresholds = thresholds;
    this.updateValidity();
  }

  // Update the widgets info
  updateWidgetInfo(name: string, type: string, stat: string): void {
    this.widget.name = name;
    this.widget.type = type;
    this.widget.properties.stat = stat;
    this.updateValidity();
  }

  updateWidgetProperties() {}

  // cancel without saving
  clearWidget(): void {
    this.widget = null;
    this.selectedMetrics.next([]);
  }

  // save widget and thresholds to squac
  saveWidget(): Observable<Widget> {
    let newWidget;
    return this.widgetService.updateWidget(this.widget).pipe(
      switchMap((response) => {
        newWidget = response;
        // returns observables for saving each thresholds
        const thresholdObs = this.thresholdService.updateThresholds(
          this.widget.thresholds,
          newWidget.id
        );
        let count = 0;
        // Wait to update view until all are saved
        if (thresholdObs && thresholdObs.length > 0) {
          return merge(...thresholdObs).pipe(
            tap(() => {
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
      })
    );
  }
}
