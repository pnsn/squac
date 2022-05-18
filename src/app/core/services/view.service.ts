// Handles communication between dashboard and widget

import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
import { Dashboard } from "@dashboard/models/dashboard";
import { DashboardService } from "@dashboard/services/dashboard.service";
import { Widget } from "@widget/models/widget";
import { WidgetService } from "@widget/services/widget.service";
import * as dayjs from "dayjs";
import { Ability } from "@casl/ability";
import { MessageService } from "./message.service";
import { DateService } from "./date.service";

@Injectable({
  providedIn: "root",
})
export class ViewService {
  // handle refreshing
  currentWidgets = new Subject<Widget[]>();
  updateData = new Subject<number>();
  resize = new Subject<number>();
  refresh = new Subject<string>();
  widgetUpdated = new Subject<number>();
  status = new BehaviorSubject<string>("loading"); // loading, error, finished
  error = new BehaviorSubject<string>(null);
  private autoRefresh: boolean;
  // refresh = new Subject<number>();
  private dashboard: Dashboard;
  dateRanges;
  queuedWidgets = 0;
  locale;
  defaultTimeRange;

  constructor(
    private dashboardService: DashboardService,
    private widgetService: WidgetService,
    private ability: Ability,
    private dateService: DateService,
    private messageService: MessageService
  ) {
    this.dateRanges = this.dateService.dateRanges;
    this.defaultTimeRange = this.dateService.defaultTimeRange;
  }

  // returns if current user can update the current dashboard
  get canUpdate(): boolean {
    return this.ability.can("update", this.dashboard);
  }

  // returns if dashboard is live
  get isLive(): boolean {
    return this.autoRefresh;
  }

  // returns the dashboard time range
  get range(): number {
    return this.dashboard?.properties.timeRange;
  }

  // returns the dashboard starttime
  get startTime(): string {
    let startTime;
    if (this.range) {
      startTime = this.dateService.subtractFromNow(this.range, "seconds");
      startTime = this.dateService.format(startTime);
    } else {
      startTime = this.dashboard?.properties.startTime;
    }
    return startTime;
  }

  // returns the dashboard end date
  get endTime(): string {
    let endTime;
    if (this.range) {
      endTime = this.dateService.now();
      endTime = this.dateService.format(endTime);
    } else {
      endTime = this.dashboard?.properties.endTime;
    }

    return endTime;
  }

  // returns the dashboard archive type
  get archiveType(): string {
    return this.dashboard?.properties.archiveType;
  }

  // returns the dashboard archive stat
  get archiveStat(): string {
    return this.dashboard?.properties.archiveStat;
  }

  // sets the given dashboard and sets up dates
  setDashboard(dashboard): void {
    this.currentWidgets.next([]);
    // clear old widgets
    this.queuedWidgets = 0;
    this.dashboard = dashboard;

    if (!dashboard.widgets || dashboard.widgets.length === 0) {
      this.status.next("finished");
    }

    this.setIntialDates();
    // return dates
  }

  // Sets up dates for dashboard
  private setIntialDates() {
    let startDate;
    let endDate;
    let autoRefresh;
    let range;

    // make date range selector
    if (this.dashboard.properties.timeRange) {
      autoRefresh = this.dashboard.properties.autoRefresh;
      range = this.dashboard.properties.timeRange;
      // set default dates
    } else if (
      this.dashboard.properties.startTime &&
      this.dashboard.properties.endTime
    ) {
      autoRefresh = false;
      startDate = this.dateService.parseUtc(
        this.dashboard.properties.startTime
      );
      endDate = this.dateService.parseUtc(this.dashboard.properties.endTime);
    } else {
      // default dates
      autoRefresh = true;
      range = this.defaultTimeRange;
    }
    this.datesChanged(startDate, endDate, autoRefresh, range);
    this.updateData.next(this.dashboard.id);
  }

  // takes given date config and saves it, emits changed dates
  datesChanged(
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    autoRefresh: boolean,
    rangeInSeconds: number
  ): void {
    this.autoRefresh = autoRefresh;
    this.dashboard.properties.timeRange = rangeInSeconds;
    let startTime;
    let endTime;
    if (startDate && endDate) {
      startTime = this.dateService.format(startDate);
      endTime = this.dateService.format(endDate);
    }
    this.dashboard.properties.startTime = startTime;
    this.dashboard.properties.endTime = endTime;
  }

  // returns the wdiget index
  private getWidgetIndexById(id: number): number {
    return this.dashboard.widgets.findIndex((w) => w.id === id);
  }

  getWidgetById(id: number) {
    return this.dashboard.widgets.find((w) => w.id === id);
  }

  // send id to resize subscribers
  resizeWidget(widgetId: number): void {
    this.resize.next(widgetId);
  }

  // sends resize with no id
  resizeAll() {
    this.resize.next(null);
  }

  // saves the given widgets
  setWidgets(widgets: Widget[]): void {
    if (this.dashboard) {
      this.dashboard.widgets = widgets;
    }

    // init dates
  }

  setArchive(archiveType, archiveStat) {
    this.dashboard.properties.archiveStat = archiveStat;
    this.dashboard.properties.archiveType = archiveType;
  }

  // decrements count of widgets still loading
  widgetFinishedLoading(): void {
    this.queuedWidgets--;
    if (this.queuedWidgets <= 0) {
      this.status.next("finished");
    }
  }

  // increments cound of widgets still loading
  widgetStartedLoading(): void {
    this.queuedWidgets++;
    if (this.queuedWidgets > 0) {
      this.status.next("loading");
    }
  }

  // broadcast id of changed widget
  private widgetChanged(widgetId: number): void {
    this.widgetUpdated.next(widgetId);
    this.status.next("finished");
    this.error.next(null);
  }

  // updates the widget
  updateWidget(widgetId: number, widget?: Widget): void {
    const index = this.getWidgetIndexById(widgetId);
    if (index > -1 && !widget) {
      this.dashboard.widgets.splice(index, 1);
      this.widgetChanged(widgetId);
    } else {
      // get widget data since incomplete widget is coming in
      this.widgetService.getWidget(widgetId).subscribe(
        (newWidget) => {
          if (index > -1) {
            this.dashboard.widgets[index] = newWidget;
            this.messageService.message("Widget updated.");
          } else {
            this.dashboard.widgets.push(newWidget);
            this.messageService.message("Widget added.");
          }
          this.widgetChanged(newWidget.id);
        },
        () => {
          this.messageService.error("Could not updated widget.");
        }
      );
    }
  }

  saveWidgetResize(widget: Widget) {
    this.widgetService.updateWidget(widget).subscribe(
      (widget) => {
        this.resizeWidget(widget.id);
        console.log("widgets saved");
      },
      (error) => {
        console.log("error in widget update: ", error);
      }
    );
  }

  // deletes given widget
  deleteWidget(widgetId): void {
    this.widgetService.deleteWidget(widgetId).subscribe(
      () => {
        this.updateWidget(widgetId);
        this.messageService.message("Widget deleted.");
      },
      () => {
        this.messageService.error("Could not delete widget.");
      }
    );
  }

  // deletes the dashboard
  deleteDashboard(dashboardId): void {
    this.dashboardService.deleteDashboard(dashboardId).subscribe(
      () => {
        this.messageService.message("Dashboard deleted.");
        // redirect to dashboards
      },
      () => {
        this.messageService.error("Could not delete dashboard.");
      }
    );
  }

  // saves the dashboard to squac
  saveDashboard(): void {
    console.log(this.dashboard);
    this.dashboardService.updateDashboard(this.dashboard).subscribe(
      () => {
        this.messageService.message("Dashboard saved.");
      },
      () => {
        this.messageService.error("Could not save dashboard.");
      }
    );
  }
  // save and refresh in here
}
