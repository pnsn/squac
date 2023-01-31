// Handles communication between dashboard and widget

import { Injectable } from "@angular/core";
import { AppAbility } from "@core/utils/ability";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { MessageService } from "@core/services/message.service";
import { Dayjs } from "dayjs";
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  Observable,
  of,
  ReplaySubject,
  Subject,
  switchMap,
  tap,
} from "rxjs";
import {
  ArchiveStatType,
  ArchiveType,
  Channel,
  ChannelGroup,
  ChannelGroupService,
  Dashboard,
  DashboardService,
  WidgetService,
} from "squacapi";
import { Widget } from "widgets";

/**
 * Service for managing dashboard and widget data
 * Some of this functionality might be better replaced
 * with ngrx or similar
 */
@Injectable({
  providedIn: "root",
})
export class ViewService {
  channels = new BehaviorSubject<Channel[]>([]); //actual channels used
  private _channelsList: Record<string, boolean>; //{ 'SCNL': boolean }
  private _channels: Channel[] = []; //all available channels
  private _channelGroupId: number;
  private _widgets: Widget[];
  channelGroupId = new BehaviorSubject<number>(null);
  currentWidgets = new Subject<Widget[]>();
  updateData = new ReplaySubject<any>(1);
  resize = new Subject<number>();
  refresh = new Subject<string>();
  widgetUpdated = new Subject<number>();
  error = new BehaviorSubject<string>(null);
  loadingCount = 0;
  private autoRefresh: boolean;
  // refresh = new Subject<number>();

  private _dashboard: Dashboard;
  queuedWidgets = 0;
  locale;
  defaultTimeRange = 3600;
  hasUnsavedChanges = false;
  constructor(
    private dashboardService: DashboardService,
    private widgetService: WidgetService,
    private ability: AppAbility,
    private dateService: DateService,
    private messageService: MessageService,
    private channelGroupService: ChannelGroupService,
    private loadingService: LoadingService
  ) {}

  /** @returns current dashboard */
  get dashboard(): Dashboard {
    return this._dashboard;
  }

  /** @returns is dashboard using live data */
  get isLive(): boolean {
    return this.autoRefresh;
  }

  /** @returns time range of dashboard */
  get range(): number {
    return this.dashboard?.properties.timeRange;
  }

  /** @returns start time of dashboard */
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

  /** @returns end time of dashboard */
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

  /** @returns all available channels on dashboard */
  get allChannels(): Channel[] {
    return [...this._channels];
  }

  /**
   * Difference between starttime and endtime in unit
   *
   * @param unit Dayjs duration
   * @returns length of time span
   */
  getTimeSpan(unit: any): number {
    const start = this.dateService.parseUtc(this.startTime);
    const end = this.dateService.parseUtc(this.endTime);
    return this.dateService.diff(end, start, unit);
  }

  /** @returns dashboard archive type */
  get archiveType(): ArchiveType {
    return this.dashboard?.properties.archiveType;
  }

  /** @returns dashboard archive stat type */
  get archiveStat(): ArchiveStatType {
    return this.dashboard?.properties.archiveStat;
  }

  /**
   * Sets new dashboard and initial dates
   *
   * @param dashboard new dashboard to intialize
   */
  setDashboard(dashboard: Dashboard): void {
    // clear old widgets
    this.currentWidgets.next([]);
    this.queuedWidgets = 0;

    // set dashboard
    this._dashboard = dashboard;
    // set dates
    this.setInitialDates();
  }

  /**
   * Updates stored channel group
   *
   * @param channelGroupId new channel group id
   */
  updateChannelGroup(channelGroupId: number): void {
    this._channelGroupId = channelGroupId;
    this.hasUnsavedChanges = true;
  }

  /**
   * Gets channel group detail from squacapi and stores channels
   *
   * @param channelGroupId id of group to fetch
   * @returns observable of channel group if found
   */
  getChannelGroup(channelGroupId: number): Observable<ChannelGroup> {
    return this.channelGroupService.read(channelGroupId).pipe(
      distinctUntilChanged(),
      tap((group) => {
        this._channels = group.channels as Channel[];
        this.dashboard.channelGroupId = group.id;
        this._channelGroupId = group.id;
      }),
      catchError(() => {
        this._channels = [];
        return of(null);
      })
    );
  }

  /**
   * Updates list of channels from channel selecta
   *
   * @param list record of nslcs that are active
   */
  updateChannels(list: Record<string, boolean>): void {
    this._channelsList = list;
    this.hasUnsavedChanges = true;
  }

  /**
   * Return all channels that are true in channelsList,
   * will return all channels if channels list is empty
   *
   * @returns filtered channels
   */
  private filterChannels(): Channel[] {
    return this._channelsList
      ? this._channels.filter((c) => {
          return this._channelsList[c.nslc];
        })
      : [...this._channels];
  }

  /**
   * Update after changes are confirmed on dashboard
   */
  updateDashboard(): void {
    // Get new channel group if there is a different id
    if (
      this._channelGroupId &&
      this._channelGroupId !== this.dashboard.channelGroupId
    ) {
      this._channelGroupId;
      this.dashboard.channelGroupId = this._channelGroupId;
      this.loadingService
        .doLoading(this.getChannelGroup(this._channelGroupId), this.dashboard)
        .subscribe(() => {
          this.sendUpdate();
        });
    } else {
      // otherwise just send updated info
      this.sendUpdate();
    }
  }

  /**
   * Emits new channels and group id, tells widgets to
   * fetch new data
   */
  private sendUpdate(): void {
    this.channelGroupId.next(this._channelGroupId);
    const channels = this.filterChannels();
    this.channels.next(channels);
    this.updateData.next({ dashboard: this.dashboard.id });
    this.hasUnsavedChanges = false;
  }

  /**
   * Gets info for dashboard and channel group
   *
   * @param dashboardId dashboard id to fetch
   * @param channelGroupId channel group id to find
   * @returns observable of channel group
   */
  setDashboardById(
    dashboardId: number,
    channelGroupId: number
  ): Observable<ChannelGroup> {
    this._widgets = [];
    this._channelGroupId = null;
    this._channels = [];
    return this.dashboardService.read(dashboardId).pipe(
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

  /**
   * Sets up initial dates for dashboard
   */
  private setInitialDates(): void {
    let startDate;
    let endDate;
    let autoRefresh;
    let range;

    if (this.dashboard.properties.timeRange) {
      // has a time range
      autoRefresh = this.dashboard.properties.autoRefresh;
      range = this.dashboard.properties.timeRange;
    } else if (
      // has start and end dates
      this.dashboard.properties.startTime &&
      this.dashboard.properties.endTime
    ) {
      // has start and end dates
      autoRefresh = false;
      startDate = this.dateService.parseUtc(
        this.dashboard.properties.startTime
      );
      endDate = this.dateService.parseUtc(this.dashboard.properties.endTime);
    } else {
      // use default dates
      autoRefresh = true;
      range = this.defaultTimeRange;
    }

    // update dates
    this.datesChanged(startDate, endDate, autoRefresh, range);
  }

  // takes given date config and saves it, emits changed dates
  /**
   * Takes date params and saves, emits changed dates
   *
   * @param startDate start date object
   * @param endDate end date object
   * @param autoRefresh true if data should auto refresh
   * @param rangeInSeconds width of time range in seconds
   */
  datesChanged(
    startDate: Dayjs,
    endDate: Dayjs,
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

  /**
   * Returns widget index
   *
   * @param id widget id
   * @returns widget index
   */
  private getWidgetIndexById(id: number): number {
    return this._widgets?.findIndex((w) => w.id === id);
  }

  /**
   * Finds widget with id
   *
   * @param id widget id
   * @returns widget
   */
  getWidgetById(id: number): Widget {
    return this._widgets.find((w) => w.id === id);
  }

  /**
   * Emits resize event with widget id
   *
   * @param widgetId id of widget to resize
   */
  resizeWidget(widgetId: number): void {
    this.resize.next(widgetId);
  }

  // sends resize with no id
  /** Emits resize event with no id */
  resizeAll(): void {
    this.resize.next(null);
  }

  /**
   * Saves given widgets
   *
   * @param widgets widgets to storea
   */
  setWidgets(widgets: Widget[]): void {
    this._widgets = widgets;
  }

  /**
   * Saves archive options
   *
   * @param archiveType new archive type
   * @param archiveStat new archive stat
   */
  setArchive(archiveType: ArchiveType, archiveStat: ArchiveStatType): void {
    this._dashboard.properties.archiveStat = archiveStat;
    this._dashboard.properties.archiveType = archiveType;
    if (archiveType === "raw") {
      this._dashboard.properties.archiveStat = null;
    }
    this.hasUnsavedChanges = true;
  }

  // broadcast id of changed widget
  /**
   * Emits id of changed widget and clears errors
   *
   * @param widgetId id to emit
   */
  private widgetChanged(widgetId: number): void {
    this.widgetUpdated.next(widgetId);
    this.error.next(null);
  }

  /**
   * Adds, updates or deletes a widget. If no widget is passed,
   * it will be removed from the saved widgets.
   *
   * @param widgetId id to update
   * @param widget widget toupdate
   */
  updateWidget(widgetId: number, widget?: Widget): void {
    const index = this.getWidgetIndexById(widgetId);
    if (index > -1 && !widget) {
      this._widgets.splice(index, 1);
      this.widgetChanged(widgetId);
    } else {
      // get widget data since incomplete widget is coming in from
      // update request
      this.widgetService.read(widgetId).subscribe({
        next: (newWidget: Widget) => {
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

  /**
   * Saves widget and tells widget to resize unless silentUpdate
   * is true
   *
   * @param widget widget to update
   * @param keys keys to update in model
   * @param silentUpdate true if widget should not resize after update
   */
  saveWidget(widget: Widget, keys: string[], silentUpdate?: boolean): void {
    if (this.ability.can("update", widget)) {
      this.widgetService.partialUpdate(widget, keys, true).subscribe({
        next: (widgetId: number) => {
          if (!silentUpdate) {
            this.resizeWidget(widgetId);
          }
        },
      });
    }
  }

  /**
   * Sends delete request to squacapi
   *
   * @param widgetId widget to delete
   */
  deleteWidget(widgetId): void {
    this.widgetService.delete(widgetId).subscribe({
      next: () => {
        this.updateWidget(widgetId);
        this.messageService.message("Widget deleted.");
      },
      error: () => {
        this.messageService.error("Could not delete widget.");
      },
    });
  }

  /**
   * Sends delete request to squacapi
   *
   * @param dashboardId dashboard to delete
   */
  deleteDashboard(dashboardId): void {
    this.dashboardService.delete(dashboardId).subscribe({
      next: () => {
        this.messageService.message("Dashboard deleted.");
      },
      error: () => {
        this.messageService.error("Could not delete dashboard.");
      },
    });
  }

  /**
   * Saves current dashboard to squacapi
   */
  saveDashboard(): void {
    this.dashboardService.updateOrCreate(this.dashboard).subscribe({
      error: () => {
        this.messageService.error("Could not save dashboard.");
      },
    });
  }
}
