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
  currentWidgets = new BehaviorSubject<Widget[]>([]);
  dates = new Subject<{start: string, end: string, live: boolean, range: number}>();
  resize = new Subject<number>();
  status = new BehaviorSubject<string>("finished"); // loading, error, finished
  error = new BehaviorSubject<string>(null);
  private live: boolean;
  // refresh = new Subject<number>();
  private widgets: Widget[] = [];
  private dashboard: Dashboard;
  // handle refreshing

  constructor(
    private dashboardService: DashboardsService,
    private widgetService: WidgetsService,
    private ability: Ability
  ) { }

  private getWidgetIndexById(id: number): number {
    for (const widgetIndex in this.widgets) {
      if (this.widgets[widgetIndex].id === id) {
        return +widgetIndex;
      }
    }
  }

  get canUpdate() {
    return this.ability.can('update', this.dashboard);
  }

  get isLive() {
    return this.live;
  }

  getRange() {
    return this.dashboard.timeRange;
  }

  getStartdate() {
    return this.dashboard.starttime;
  }

  getEnddate() {
    return this.dashboard.endtime;
  }

  resizeWidget(widgetId: number) {
    this.resize.next(widgetId);
  }

  queuedWidgets : number = 0;
  widgetFinishedLoading() {
    this.queuedWidgets--;
    if(this.queuedWidgets <= 0) {
      this.status.next("finished");
    }
  }

  widgetStartedLoading() {
    this.queuedWidgets++;
    if(this.queuedWidgets > 0) {
      this.status.next("loading");
    }
  }

  datesChanged(startDate: moment.Moment, endDate: moment.Moment, live: boolean, range?: number) {
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

  dashboardSelected(dashboard: Dashboard) {

    // set dates

    // clear old widgets
    if(this.dashboard) {
      this.dashboard.widgets = [];
      this.updateCurrentWidgets();
    }

    this.dashboard = dashboard;
    if (dashboard.widgetIds.length === 0) {
      this.status.next('finished');
    }
  }

  // FIXME: this currently will cause all widgets to reload;
  private widgetsChanged() {
    this.status.next('finished');
    this.error.next(null);
    this.updateCurrentWidgets();
  }

  private updateCurrentWidgets() {
    // add widgets to Dashboard
    this.currentWidgets.next(this.dashboard.widgets.slice());
  }

  getWidgets(dashboardId) {

    this.status.next('loading');
    this.widgetService.getWidgets(dashboardId).subscribe(
      (widgets: Widget[]) => {
        this.dashboard.widgets = widgets;
      },
      error => {
        this.handleError('Could not load widgets for dashboard ' + dashboardId + '.', 'getWidgets', error);
      },
      () => {
        this.widgetsChanged();
        console.log('Get widgets done');
      }
    );
  }

  updateWidget(widgetId) {
    console.log('get widgets');
    this.status.next('loading');
    this.widgetService.getWidget(widgetId).subscribe(
      (widget: Widget) => {
        const index = this.getWidgetIndexById(widget.id);

        this.dashboard.widgets[index] = widget;
        this.widgetsChanged();
      },
      error => {
        this.handleError('Could not update widget with ID: ' + widgetId, 'updateWidget', error);
      }
    );
  }

  addWidget(widgetId) {
    this.status.next('loading');
    this.widgetService.getWidget(widgetId).subscribe(
      (widget: Widget) => {
        this.dashboard.widgets.push(widget);
        this.widgetsChanged();
      },
      error => {
        this.handleError('Could not add widget with ID: ' + widgetId, 'addWidget', error);
      }
    );
  }

  deleteWidget(widgetId) {
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
  refreshWidgets() {
    console.log('refresh!');
    this.getWidgets(this.dashboard.id);
  }

  handleError(message, source, error) {
    this.error.next(message);
    console.log('Error in view service ' + source + ': ' + error);
    this.status.next('error');
  }

  deleteDashboard(dashboard) {
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

  saveDashboard() {
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
