// Handles communication between dashboard and widget

import { Injectable } from "@angular/core";
import {
  Subject,
  BehaviorSubject,
  Observable,
  tap,
  take,
  switchMap,
  of,
  distinctUntilChanged,
} from "rxjs";
import { Dashboard } from "@dashboard/models/dashboard";
import { DashboardService } from "@dashboard/services/dashboard.service";
import { Widget } from "@widget/models/widget";
import { WidgetService } from "@widget/services/widget.service";
import * as dayjs from "dayjs";
import { Ability } from "@casl/ability";
import { MessageService } from "./message.service";
import { DateService } from "./date.service";
import { Channel } from "@core/models/channel";
import { ChannelGroupService } from "@features/channel-group/services/channel-group.service";
import { ChannelGroup } from "@core/models/channel-group";

@Injectable({
  providedIn: "root",
})
export class ViewService {
  // handle refreshing
  channels = new BehaviorSubject<Channel[]>([]);
  channelGroupId = new BehaviorSubject<number>(null);
  currentWidgets = new Subject<Widget[]>();
  updateData = new Subject<number>();
  resize = new Subject<number>();
  refresh = new Subject<string>();
  widgetUpdated = new Subject<number>();
  status = new BehaviorSubject<string>("loading"); // loading, error, finished
  error = new BehaviorSubject<string>(null);
  loadingCount = 0;
  private autoRefresh: boolean;
  // refresh = new Subject<number>();

  private _dashboard: Dashboard;
  dateRanges;
  queuedWidgets = 0;
  locale;
  defaultTimeRange;

  constructor(
    private dashboardService: DashboardService,
    private widgetService: WidgetService,
    private ability: Ability,
    private dateService: DateService,
    private messageService: MessageService,
    private channelGroupService: ChannelGroupService
  ) {
    this.dateRanges = this.dateService.dateRanges;
    this.defaultTimeRange = this.dateService.defaultTimeRange;
  }

  get dashboard(): Dashboard {
    return this._dashboard;
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

  // get channels as commas separated string
  get channelsString(): string {
    let str = "";
    this.channels.pipe(take(1)).subscribe((channels) => {
      channels.forEach((channel, i) => {
        str += channel.id;
        if (i !== channels.length - 1) {
          str += ",";
        }
      });
    });
    return str;
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

  //get amount of time between start and end
  getTimeSpan(unit: any): number {
    const start = this.dateService.parseUtc(this.startTime);
    const end = this.dateService.parseUtc(this.endTime);
    return this.dateService.diff(end, start, unit);
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
  setDashboard(dashboard: Dashboard): void {
    this.finishedLoading();
    this.currentWidgets.next([]);
    // clear old widgets
    this.queuedWidgets = 0;
    this._dashboard = dashboard;
    if (!dashboard.widgetIds || dashboard.widgetIds.length === 0) {
      this.status.next("finished");
    }

    this.setIntialDates();
    // return dates
  }

  updateChannelGroup(channelGroupId: number): Observable<ChannelGroup> {
    return this.channelGroupService.getChannelGroup(channelGroupId).pipe(
      distinctUntilChanged(),
      tap((group) => {
        this.channels.next(group.channels);
        this.channelGroupId.next(group.id);
      })
    );
  }

  // send out new channels
  updateChannels(channels: Channel[]) {
    this.channels.next(channels);
  }

  setDashboardById(
    dashboardId: number,
    channelGroupId: number
  ): Observable<ChannelGroup> {
    return this.dashboardService.getDashboard(dashboardId).pipe(
      tap({
        next: (dashboard) => {
          this.setDashboard(dashboard);
        },
        error: () => {
          this.status.next("error");
        },
      }),
      switchMap((dashboard) => {
        const groupId = channelGroupId || dashboard.channelGroupId;
        if (groupId) {
          return this.updateChannelGroup(groupId);
        } else {
          return of(null);
        }
      })
    );
  }

  //setChannelGroupById

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
    this._dashboard.properties.timeRange = rangeInSeconds;
    let startTime;
    let endTime;
    if (startDate && endDate) {
      startTime = this.dateService.format(startDate);
      endTime = this.dateService.format(endDate);
    }
    this._dashboard.properties.startTime = startTime;
    this._dashboard.properties.endTime = endTime;
  }

  // returns the wdiget index
  private getWidgetIndexById(id: number): number {
    return this._dashboard.widgets?.findIndex((w) => w.id === id);
  }

  // return widget with given id
  getWidgetById(id: number): Widget {
    return this._dashboard.widgets.find((w) => w.id === id);
  }

  // send id to resize subscribers
  resizeWidget(widgetId: number): void {
    this.resize.next(widgetId);
  }

  // sends resize with no id
  resizeAll(): void {
    this.resize.next(null);
  }

  // saves the given widgets
  setWidgets(widgets: Widget[]): void {
    if (this.dashboard) {
      this._dashboard.widgets = widgets;
    }
  }

  // stores archive options
  setArchive(archiveType, archiveStat) {
    this._dashboard.properties.archiveStat = archiveStat;
    this._dashboard.properties.archiveType = archiveType;
  }

  // decrements count of widgets still loading
  finishedLoading(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.status.next("finished");
    }
  }

  // increments cound of widgets still loading
  startedLoading(): void {
    this.loadingCount++;
    if (this.loadingCount > 0) {
      this.status.next("loading");
    }
  }

  // broadcast id of changed widget
  private widgetChanged(widgetId: number): void {
    this.widgetUpdated.next(widgetId);
    this.finishedLoading();
    this.error.next(null);
  }

  // updates the widget
  updateWidget(widgetId: number, widget?: Widget): void {
    this.startedLoading();
    const index = this.getWidgetIndexById(widgetId);
    if (index > -1 && !widget) {
      this._dashboard.widgets.splice(index, 1);
      this.widgetChanged(widgetId);
    } else {
      // get widget data since incomplete widget is coming in
      this.widgetService.getWidget(widgetId).subscribe({
        next: (newWidget) => {
          if (index > -1) {
            this._dashboard.widgets[index] = newWidget;
            this.messageService.message("Widget updated.");
          } else {
            this._dashboard.widgets.push(newWidget);
            this.messageService.message("Widget added.");
          }
          this.widgetChanged(newWidget.id);
        },
        error: () => {
          this.messageService.error("Could not updated widget.");
        },
      });
    }
  }

  // Tell widgets to resize
  saveWidgetResize(widget: Widget) {
    this.widgetService.updateWidget(widget).subscribe({
      next: (widget) => {
        this.resizeWidget(widget.id);
      },
      error: (error) => {
        console.error("error in widget update: ", error);
      },
    });
  }

  // deletes given widget
  deleteWidget(widgetId): void {
    this.widgetService.deleteWidget(widgetId).subscribe({
      next: () => {
        this.updateWidget(widgetId);
        this.messageService.message("Widget deleted.");
      },
      error: () => {
        this.messageService.error("Could not delete widget.");
      },
    });
  }

  // deletes the dashboard
  deleteDashboard(dashboardId): void {
    this.dashboardService.deleteDashboard(dashboardId).subscribe({
      next: () => {
        this.messageService.message("Dashboard deleted.");
        // redirect to dashboards
      },
      error: () => {
        this.messageService.error("Could not delete dashboard.");
      },
    });
  }

  // saves the dashboard to squac
  saveDashboard(): void {
    this.dashboardService.updateDashboard(this.dashboard).subscribe({
      error: () => {
        this.messageService.error("Could not save dashboard.");
      },
    });
  }
  // save and refresh in here
}
