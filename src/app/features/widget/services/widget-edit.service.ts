import { Injectable } from "@angular/core";
import { Widget } from "@widget/models/widget";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { Threshold } from "../models/threshold";
import { BehaviorSubject, Subject, Observable, merge, of } from "rxjs";
import { WidgetService } from "./widget.service";
import { ViewService } from "@core/services/view.service";
import { switchMap, tap } from "rxjs/operators";

// TODO: this whole thing just needs a fixin'
@Injectable({
  providedIn: "root",
})
export class WidgetEditService {
  private _widget: Widget;
  public selectedMetrics = new BehaviorSubject<Metric[]>([]);
  public selectedType = new Subject<string>();
  public isValid = new Subject<boolean>();
  dashboardId: number;

  constructor(
    private widgetService: WidgetService,
    private viewService: ViewService
  ) {}

  get thresholds(): Threshold[] {
    return this.widget?.thresholds;
  }
  get channelGroup(): ChannelGroup {
    return this.widget?.channelGroup;
  }

  get type(): string {
    return this.widget?.type;
  }

  // Keeps track of widget having all required properties
  updateValidity(): void {
    this.isValid.next(this.widget.isValid);
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
      this.widget.properties;
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

  // Save the new selected thresholds
  updateThresholds(thresholds: any[]): void {
    this.widget.thresholds = thresholds;
    this.updateValidity();
  }

  // Update the widgets info
  updateWidgetInfo(name: string, type: string, stat: string): void {
    this.widget.name = name;
    this.widget.type = type;
    this.selectedType.next(type);
    this.widget.properties.stat = stat;
    this.updateValidity();
  }

  updateWidgetProperties(props) {
    for (const key in props) {
      this.widget.properties[key] = props[key];
    }
    console.log(this.widget.properties);
  }

  // cancel without saving
  clearWidget(): void {
    this.widget = null;
    this.selectedMetrics.next([]);
  }

  // save widget and thresholds to squac
  saveWidget(): Observable<Widget> {
    return this.widgetService.updateWidget(this.widget).pipe(
      tap((widget) => {
        this.viewService.updateWidget(widget.id, widget);
        return of(widget);
      })
    );
  }
}
