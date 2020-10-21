// Handles communication between dashboard and widget

import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
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
  currentWidgets = new Subject<Widget[]>();
  dates = new ReplaySubject<{start: string, end: string, live: boolean, range: number}>();
  resize = new Subject<number>();
  status = new BehaviorSubject<string>('loading'); // loading, error, finished
  error = new BehaviorSubject<string>(null);
  private live: boolean;
  // refresh = new Subject<number>();
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


    if( range && range!== this.dashboard.timeRange || 
        start !== this.dashboard.starttime || 
        end !== this.dashboard.endtime || 
        this.live != live) {
          
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


    }


    // this is setting status to loading when it shouldn't
    // this.status.next('loading');
  }

  dashboardSelected(dashboard: Dashboard): void {
    // clear old widgets
    if (this.dashboard) {
      this.dashboard.widgets = [];
      this.queuedWidgets = 0;
    }

    this.dashboard = dashboard;
    // if no widgets
    if (dashboard.widgetIds && dashboard.widgetIds.length === 0) {
      console.log("dashboard done")
      this.status.next('finished');
    }
  }

  // FIXME: this currently will cause all widgets to reload;
  private widgetChanged(widgetId: number): void {
    this.status.next('finished');
    this.error.next(null);
    this.currentWidgets.next(this.dashboard.widgets.slice());
  }

  updateWidget(widgetId: number, widget?: Widget): void {
    const index = this.getWidgetIndexById(widgetId);
    if (index > -1  && !widget) {
      this.dashboard.widgets.splice(index, 1);
      this.widgetChanged(widgetId);
    } else {
      // get widget data since incomplete widget is coming in
      this.widgetService.getWidget(widgetId).subscribe(
        newWidget => {
          if (index > -1) {
            this.dashboard.widgets[index] = newWidget;
          } else {
            this.dashboard.widgets.push(newWidget);
          }
          this.widgetChanged(widgetId);
        }
      );
    }

  }


  deleteWidget(widgetId): void {
    this.widgetService.deleteWidget(widgetId).subscribe(
      next => {
        this.updateWidget(widgetId);
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

  deleteDashboard(dashboardId): void {
    this.dashboardService.deleteDashboard(dashboardId).subscribe(
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
    this.dashboardService.updateDashboard(this.dashboard).subscribe(
      response => {
        console.log('dashboard saved');
      },
      error => {
        this.handleError('Could not save dashboard.', 'saveDashboard', error);
      },
      () => {

      }
    );
  }
  // save and refresh in here
}
