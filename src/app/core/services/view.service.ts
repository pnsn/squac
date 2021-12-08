// Handles communication between dashboard and widget

import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { Dashboard } from '@features/dashboards/models/dashboard';
import { DashboardsService } from '@features/dashboards/services/dashboards.service';
import { Widget } from '@features/widgets/models/widget';
import { WidgetsService } from '@features/widgets/services/widgets.service';
import * as moment from 'moment';
import { Ability } from '@casl/ability';
import { ConfigurationService } from './configuration.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  // handle refreshing
  currentWidgets = new Subject<Widget[]>();
  dates = new ReplaySubject<number>(1);
  resize = new Subject<number>();
  refresh = new Subject<string>();
  status = new BehaviorSubject<string>('loading'); // loading, error, finished
  error = new BehaviorSubject<string>(null);
  private live: boolean;
  // refresh = new Subject<number>();
  private dashboard: Dashboard;
  dateRanges;
  queuedWidgets = 0;
  locale;
  defaultTimeRange;

  constructor(
    private dashboardService: DashboardsService,
    private widgetService: WidgetsService,
    private ability: Ability,
    configService: ConfigurationService,
    private messageService: MessageService
  ) {
    this.locale = configService.getValue('locale', {
      format: 'YYYY-MM-DDTHH:mm:ss[Z]',
      displayFormat: 'YYYY/MM/DD HH:mm',
      direction: 'ltr',
    });
    this.dateRanges = configService.getValue('dateRanges', {
      3600: 'last 1 hour',
    });
    this.defaultTimeRange = configService.getValue('defaultTimeRange', 3);
  }

  // returns if current user can update the current dashboard
  get canUpdate(): boolean {
    return this.ability.can('update', this.dashboard);
  }

  // returns if dashboard is live
  get isLive(): boolean {
    return this.live;
  }

  // returns the dashboard time range
  get range(): number {
    return this.dashboard?.timeRange;
  }

  // returns the dashboard starttime
  get startdate(): string {
    return this.dashboard?.starttime;
  }

  // returns the dashboard end date
  get enddate(): string {
    return this.dashboard?.endtime;
  }

  // returns the dashboard archive type
  get archiveType(): string {
    return this.dashboard?.archiveType;
  }

  // returns the dashboard archive stat
  get archiveStat(): string {
    return this.dashboard?.archiveStat;
  }

  // sets the given dashboard and sets up dates
  setDashboard(dashboard: Dashboard): void {
    this.currentWidgets.next([]);
    // clear old widgets
    this.queuedWidgets = 0;
    this.dashboard = dashboard;

    if (dashboard.widgetIds && dashboard.widgetIds.length === 0) {
      this.status.next('finished');
    }

    this.setIntialDates();
    // return dates
  }

  // takes given date config and saves it, emits changed dates
  datesChanged(
    startDate: moment.Moment,
    endDate: moment.Moment,
    live: boolean,
    range?: number
  ): void {
    if (startDate && endDate) {
      const start = startDate.format(this.locale.format);
      const end = endDate.format(this.locale.format);
      this.live = live;

      this.dashboard.timeRange = range ? range : null;

      this.dashboard.starttime = start;
      this.dashboard.endtime = end;

      this.updateData();
    }
    // this.status.next('loading');
  }

  // returns the wdiget index
  private getWidgetIndexById(id: number): number {
    return this.dashboard.widgets.findIndex((w) => w.id === id);
  }

  // send id to resize subscribers
  resizeWidget(widgetId: number): void {
    this.resize.next(widgetId);
  }

  // sends resize with no id
  resizeAll() {
    this.resize.next(null);
  }

  // tell widgets to get new data
  updateData() {
    this.dates.next(this.dashboard.id);
  }

  // saves the given widgets
  setWidgets(widgets: Widget[]): void {
    if (this.dashboard) {
      this.dashboard.widgets = widgets;
    }

    // init dates
  }

  setArchive( archiveType, archiveStat ) {
    this.dashboard.archiveStat = archiveStat;
    this.dashboard.archiveType = archiveType;

    this.updateData();
  }

  // Sets up dates for dashboard
  private setIntialDates() {
    const current = moment.utc();
    let startDate;
    let endDate;
    let liveMode;
    let range;
    // make date range selector
    if (this.dashboard.timeRange) {
      liveMode = true;
      (startDate = moment.utc().subtract(this.dashboard.timeRange, 'seconds')),
        (endDate = current);
      range = this.dashboard.timeRange;
      // set default dates
    } else if (this.dashboard.starttime && this.dashboard.endtime) {
      liveMode = false;
      startDate = moment.utc(this.dashboard.starttime);
      endDate = moment.utc(this.dashboard.endtime);
    } else {
      // default dates
      liveMode = true;
      startDate = moment.utc().subtract(this.defaultTimeRange, 'seconds');
      range = this.defaultTimeRange;
      endDate = current;
    }
    this.datesChanged(startDate, endDate, liveMode, range);
  }

  // decrements count of widgets still loading
  widgetFinishedLoading(): void {
    this.queuedWidgets--;
    if (this.queuedWidgets <= 0) {
      this.status.next('finished');
    }
  }

  // increments cound of widgets still loading
  widgetStartedLoading(): void {
    this.queuedWidgets++;
    if (this.queuedWidgets > 0) {
      this.status.next('loading');
    }
  }

  // FIXME: this currently will cause all widgets to reload;
  // Tells widgets to get new data
  private widgetChanged(widgetId: number): void {
    this.status.next('finished');
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
          } else {
            this.dashboard.widgets.push(newWidget);
          }
          this.widgetChanged(widgetId);
          this.messageService.message('Widget updated.');
        },
        (error) => {
          this.messageService.error('Could not updated widget.');
        }
      );
    }
  }

  // deletes given widget
  deleteWidget(widgetId): void {
    this.widgetService.deleteWidget(widgetId).subscribe(
      (next) => {
        this.updateWidget(widgetId);
        this.messageService.message('Widget deleted.');
      },
      (error) => {
        this.messageService.error('Could not delete widget.');
      }
    );
  }

  // TODO: this should refresh widget info if its going to be lvie
  // Will rerender widgets, but not get new widget information
  refreshWidgets(): void {
    this.refresh.next('refresh');
    // this.getWidgets(this.dashboard.id);
  }

  // deletes the dashboard
  deleteDashboard(dashboardId): void {
    this.dashboardService.deleteDashboard(dashboardId).subscribe(
      (response) => {
        this.messageService.message('Dashboard deleted.');
        // redirect to dashboards
      },
      (error) => {
        this.messageService.error('Could not delete dashboard.');
      }
    );
  }

  // saves the dashboard to squac
  saveDashboard(): void {
    this.dashboardService.updateDashboard(this.dashboard).subscribe(
      (response) => {
        this.messageService.message('Dashboard saved.');
      },
      (error) => {
        this.messageService.error('Could not save dashboard.');
      }
    );
  }
  // save and refresh in here
}
