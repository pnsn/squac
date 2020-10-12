// Handles communication between dashboard and widget

import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Dashboard } from '@features/dashboards/models/dashboard';
import { DashboardsService } from '@features/dashboards/services/dashboards.service';
import { Widget } from '@features/widgets/models/widget';
import { WidgetsService } from '@features/widgets/services/widgets.service';
import * as moment from 'moment';
import { Ability } from '@casl/ability';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  // handle refreshing

  constructor(
    private dashboardService: DashboardsService,
    private widgetService: WidgetsService,
    private ability: Ability
  ) { }

  get canUpdate(): boolean {
    return this.ability.can('update', this.dashboard);
  }

  get isLive(): boolean {
    return this.live;
  }
  currentWidgets = new BehaviorSubject<Widget[]>([]);
  dates = new Subject<{start: string, end: string, live: boolean, range: number}>();
  resize = new Subject<number>();
  status = new BehaviorSubject<string>('finished'); // loading, error, finished
  error = new BehaviorSubject<string>(null);
  private live: boolean;
  // refresh = new Subject<number>();
  private widgets: Widget[] = [];
  private dashboard: Dashboard;

  queuedWidgets = 0;

  private getWidgetIndexById(id: number): number {
    return this.dashboard.widgets.findIndex(w => w.id === id);
  }

  getRange(): number {
    return this.dashboard.timeRange;
  }

  getStartdate(): string {
    return this.dashboard.starttime;
  }

  getEnddate(): string {
    return this.dashboard.endtime;
  }

  resizeWidget(widgetId: number): void {
    this.resize.next(widgetId);
  }
  setWidgets(widgets: Widget[]): void {
    this.dashboard.widgets = widgets;
    console.log(this.dashboard.widgets);
  }
  getWidget(id): Widget | boolean {
    const index = this.getWidgetIndexById(id);
    return index > -1 ? this.dashboard.widgets[index] : false;
  }
  widgetFinishedLoading(): void {
    this.queuedWidgets--;
    if (this.queuedWidgets <= 0) {
      this.status.next('finished');
    }
  }

  widgetStartedLoading(): void {
    this.queuedWidgets++;
    if (this.queuedWidgets > 0) {
      this.status.next('loading');
    }
  }

  datesChanged(startDate: moment.Moment, endDate: moment.Moment, live: boolean, range?: number): void {
    const start = startDate.format('YYYY-MM-DDTHH:mm:ss[Z]');
    const end = endDate.format('YYYY-MM-DDTHH:mm:ss[Z]');
    this.live = live;

    this.dashboard.timeRange = range;
    this.dashboard.starttime = start;
    this.dashboard.endtime = end;

    this.dates.next({
      start,
      end,
      live,
      range
    });
    // this is setting status to loading when it shouldn't
    // this.status.next('loading');
  }

  dashboardSelected(dashboard: Dashboard): void {

    // set dates

    // clear old widgets
    if (this.dashboard) {
      this.dashboard.widgets = [];
      this.queuedWidgets = 0;
      this.updateCurrentWidgets();
    }

    this.dashboard = dashboard;
    if (dashboard.widgetIds && dashboard.widgetIds.length === 0) {
      this.status.next('finished');
    }
  }

  // FIXME: this currently will cause all widgets to reload;
  private widgetsChanged(): void {
    this.status.next('finished');
    this.error.next(null);
    this.updateCurrentWidgets();
  }

  private updateCurrentWidgets(): void {
    // add widgets to Dashboard
    this.currentWidgets.next(this.dashboard.widgets.slice());
  }


  updateWidget(widget): void {
    console.log('get widgets');
    const index = this.getWidgetIndexById(widget.id);
    if (index > -1) {
      this.dashboard.widgets[index] = widget;
    } else {
      this.dashboard.widgets.push(widget);
    }
  }

  deleteWidget(widgetId): void {
    this.status.next('loading');
    const index = this.getWidgetIndexById(widgetId);
    this.widgetService.deleteWidget(widgetId).subscribe(
      next => {
        this.dashboard.widgets.splice(index, 1);
        this.widgetsChanged();
      },
      error => {
        this.handleError('Could not delete widget with ID: ' + widgetId, 'deleteWidget', error);
      }
    );

  }

  // TODO: this should refresh widget info if its going to be lvie
  // Will rerender widgets, but not get new widget information
  refreshWidgets(): void {
    console.log('refresh!');
    // this.getWidgets(this.dashboard.id);
  }

  private handleError(message, source, error): void {
    this.error.next(message);
    console.log('Error in view service ' + source + ': ' + error);
    this.status.next('error');
  }

  deleteDashboard(dashboard): void {
    this.dashboardService.deleteDashboard(dashboard.id).subscribe(
      response => {
        console.log('dashboard deleted');
        // redirect to /dashboards
      },
      error => {
        console.log('Failed to delete dashboard.');
      }
    );
  }

  saveDashboard(): void {
    console.log(this.dashboard);
    this.dashboardService.updateDashboard(this.dashboard).subscribe(
      response => {
        console.log('dashboard saved');
      },
      error => {
        this.handleError('Could not save dashboard.', 'saveDashboard', error);
      },
      () => {
        console.log('Dashboard save complete');
      }
    );
  }
  // save and refresh in here
}
