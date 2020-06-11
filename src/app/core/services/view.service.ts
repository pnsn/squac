// service that actually has dashboard info -takes it out of component
// Handles communication between dashboard and widget

import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Dashboard } from '../../features/dashboards/dashboard';
import { DashboardsService } from '../../features/dashboards/dashboards.service';
import { ChannelGroup } from '../models/channel-group';
import { Widget } from '../models/widget';
import { WidgetsService } from 'src/app/features/widgets/widgets.service';
import { MeasurementsService } from 'src/app/features/widgets/measurements.service';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  currentDashboard = new Subject<Dashboard>();
  currentWidgets = new BehaviorSubject<Widget[]>([]);
  dates = new Subject<{start: Date, end: Date}>();
  resize = new Subject<number>();
  status = new Subject<string>(); // loading, error, finished
  error = new Subject<string>();
  private startdate: Date;
  private enddate: Date;
  // refresh = new Subject<number>();

  private widgets: Widget[] = [];
  private dashboard: Dashboard;
  // handle refreshing

  constructor(
    private dashboardService: DashboardsService,
    private widgetService: WidgetsService,
    private measurementService: MeasurementsService
  ) { }

  private getWidgetIndexById(id: number): number {
    for (const widgetIndex in this.widgets) {
      if (this.widgets[widgetIndex].id === id) {
        return +widgetIndex;
      }
    }
  }

  getStartdate() {
    return this.startdate;
  }

  getEnddate() {
    return this.enddate;
  }

  resizeWidget(widgetId: number) {
    this.resize.next(widgetId);
  }

  datesChanged(start: Date, end: Date) {
    this.startdate = start;
    this.enddate = end;
    this.dates.next({
      start,
      end
    });
  }


  // TODO: clear up some redundancy
  dashboardSelected(id, start, end) {
    console.log('dashboard selected');
    this.startdate = start;
    this.enddate = end;
    this.status.next('loading');

    this.widgets = [];
    this.updateCurrentWidgets();

    this.updateDashboard(null);

    this.dashboardService.getDashboard(id).subscribe(
      dashboard => {
        this.updateDashboard(dashboard);
        this.getWidgets(dashboard.id);
      },
      error => {
        this.updateDashboard(null);
        this.handleError('Could not load dashboard ' + id + '.', 'dashboardSelected', error);
      },
      () => {
        console.log('dashboard complete');
      }
    );
  }

  // FIXME: this currently will cause all widgets to reload;
  private widgetsChanged() {
    this.updateCurrentWidgets();
    this.status.next('finished');
    this.error.next(null);
    this.dashboard.updateWidgets(this.widgets.slice());
    this.updateDashboard(this.dashboard);
  }

  private updateCurrentWidgets() {
    // add widgets to Dashboard
    this.currentWidgets.next(this.widgets.slice());
  }

  private updateDashboard(dashboard) {
    this.dashboard = dashboard;
    this.currentDashboard.next(this.dashboard);
  }

  getWidgets(dashboardId) {
    this.status.next('loading');
    this.widgetService.getWidgetsByDashboardId(dashboardId).subscribe(
      (widgets: Widget[]) => {
        this.widgets = widgets;
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
    this.status.next('loading');
    this.widgetService.getWidget(widgetId).subscribe(
      (widget: Widget) => {
        const index = this.getWidgetIndexById(widget.id);

        this.widgets[index] = widget;
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
        this.widgets.push(widget);
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
        this.widgets.splice(index, 1);
        this.widgetsChanged();
      },
      error => {
        this.handleError('Could not delete widget with ID: ' + widgetId, 'deleteWidget', error);
      }
    );

  }

  // TODO: does this actuall refresh data?
  refreshWidgets() {
    console.log('refresh!');
    this.widgetsChanged();
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
        this.updateDashboard(null);
        // redirect to /dashboards
      },
      error => {
        console.log('Failed to delete dashboard.');
      }
    );
  }

  saveDashboard(dashboard: Dashboard) {
    this.dashboardService.updateDashboard(dashboard).subscribe(
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
