// Handles communication between dashboard and widget

import { Injectable } from "@angular/core";
import {
  Subject,
  BehaviorSubject,
  Observable,
  tap,
  switchMap,
  of,
  distinctUntilChanged,
  catchError,
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
import { LoadingService } from "./loading.service";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class ViewService {
  // handle refreshing
  channels = new BehaviorSubject<Channel[]>([]); //actual channels used
  private _channelsList: FormGroup; //{ 'SCNL': boolean }
  private _channels: Channel[] = []; //all available channels
  private _channelGroupId: number;
  private _widgets: Widget[];
  channelGroupId = new BehaviorSubject<number>(null);
  currentWidgets = new Subject<Widget[]>();
  updateData = new Subject<any>();
  resize = new Subject<number>();
  refresh = new Subject<string>();
  widgetUpdated = new Subject<number>();
  error = new BehaviorSubject<string>(null);
  loadingCount = 0;
  private autoRefresh: boolean;
  // refresh = new Subject<number>();

  private _dashboard: Dashboard;
  dateRanges;
  queuedWidgets = 0;
  locale;
  defaultTimeRange;
  hasUnsavedChanges = false;
  constructor(
    private dashboardService: DashboardService,
    private widgetService: WidgetService,
    private ability: Ability,
    private dateService: DateService,
    private messageService: MessageService,
    private channelGroupService: ChannelGroupService,
    private loadingService: LoadingService
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

  // get all available channels
  get allChannels(): Channel[] {
    return [...this._channels];
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
    this.currentWidgets.next([]);
    // clear old widgets
    this.queuedWidgets = 0;
    this._dashboard = dashboard;
    this.setIntialDates();
    // return dates
  }

  updateChannelGroup(channelGroupId: number) {
    this._channelGroupId = channelGroupId;
    this.hasUnsavedChanges = true;
  }

  getChannelGroup(channelGroupId: number): Observable<ChannelGroup> {
    return this.channelGroupService.read(channelGroupId).pipe(
      distinctUntilChanged(),
      tap((group) => {
        this._channels = group.channels;
        this.dashboard.channelGroupId = group.id;
        this._channelGroupId = group.id;
      }),
      catchError(() => {
        return of(null);
      })
    );
  }

  // { NSLC : true/false} from channel select
  updateChannels(list: FormGroup) {
    this._channelsList = list;
    this.hasUnsavedChanges = true;
  }

  // filter _channels that are true in channelsList
  // if no filter list, return all channels
  private filterChannels() {
    return this._channelsList
      ? this._channels.filter((c) => {
          return this._channelsList[c.nslc];
        })
      : [...this._channels];
  }

  // send updates and reset values
  updateDashboard(): void {
    //get new channelgroup info if its changed
    if (this._channelGroupId !== this.dashboard.channelGroupId) {
      this.dashboard.channelGroupId = this._channelGroupId;
      this.loadingService
        .doLoading(this.getChannelGroup(this._channelGroupId), this.dashboard)
        .subscribe(() => {
          this.sendUpdate();
        });
    } else {
      this.sendUpdate();
    }
  }

  private sendUpdate() {
    this.channelGroupId.next(this._channelGroupId);
    const channels = this.filterChannels();

    this.channels.next(channels);
    this.updateData.next({ dashboard: this.dashboard.id });
    this.hasUnsavedChanges = false;
    // this._channelsList = undefined;
    // this._channelGroupId = null;
  }

  setDashboardById(
    dashboardId: number,
    channelGroupId: number
  ): Observable<ChannelGroup> {
    this._widgets = [];
    return this.dashboardService.getDashboard(dashboardId).pipe(
      tap({
        next: (dashboard) => {
          this.setDashboard(dashboard);
        },
        error: () => {
          //do something about error
        },
      }),
      switchMap((dashboard) => {
        const groupId = channelGroupId || dashboard.channelGroupId;
        if (groupId) {
          return this.getChannelGroup(groupId);
        } else {
          return of(null);
        }
      }),
      tap(() => {
        this.updateDashboard();
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
    this.hasUnsavedChanges = true;
  }

  // returns the wdiget index
  private getWidgetIndexById(id: number): number {
    return this._widgets?.findIndex((w) => w.id === id);
  }

  // return widget with given id
  getWidgetById(id: number): Widget {
    return this._widgets.find((w) => w.id === id);
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
    this._widgets = widgets;
  }

  // stores archive options
  setArchive(archiveType, archiveStat) {
    this._dashboard.properties.archiveStat = archiveStat;
    this._dashboard.properties.archiveType = archiveType;
    this.hasUnsavedChanges = true;
  }

  // broadcast id of changed widget
  private widgetChanged(widgetId: number): void {
    this.widgetUpdated.next(widgetId);
    this.error.next(null);
  }

  // updates the widget
  updateWidget(widgetId: number, widget?: Widget): void {
    const index = this.getWidgetIndexById(widgetId);
    if (index > -1 && !widget) {
      this._widgets.splice(index, 1);
      this.widgetChanged(widgetId);
    } else {
      // get widget data since incomplete widget is coming in
      this.widgetService.getWidget(widgetId).subscribe({
        next: (newWidget) => {
          if (index > -1) {
            this._widgets[index] = newWidget;
            this.messageService.message("Widget updated.");
          } else {
            this._widgets.push(newWidget);
            this.messageService.message("Widget added.");
          }
          this.widgetChanged(newWidget.id);
        },
        error: () => {
          this.messageService.error("Could not update widget.");
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
