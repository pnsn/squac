// service that actually has dashboard info -takes it out of component
// Handles communication between dashboard and widget

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Dashboard } from '../dashboards/dashboard';
import { Widget } from '../widgets/widget';
import { MeasurementsService } from '../widgets/measurements.service';
import { WidgetsService } from '../widgets/widgets.service';
import { DashboardsService } from '../dashboards/dashboards.service';
import { ChannelGroup } from './channel-group';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  currentDashboard = new Subject<Dashboard>();
  currentWidgets = new Subject<Widget[]>();
  dates = new Subject<{start: Date, end: Date}>();
  resize = new Subject<number>();
  status = new Subject<string>(); // loading, error, finished
  error = new Subject<string>();
  private startdate: Date;
  private enddate: Date;
  // refresh = new Subject<number>();

  private widgets: Widget[] = [];
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

  dashboardSelected(id, start, end) {
    this.startdate = start;
    this.enddate = end;
    this.status.next('loading');
    this.dashboardService.getDashboard(id).subscribe(
      dashboard => {
        this.currentDashboard.next(dashboard);
        this.getWidgets(dashboard.id);
      },
      error => {
        this.error.next("Could not load dashboard.");
        console.log('error in view service getDashboard: ' + error);
      }
    );
  }

  // FIXME: this currently will cause all widgets to reload;
  private widgetsChanged() {
    this.currentWidgets.next(this.widgets.slice());
    this.status.next('finished');
    this.error.next(null);
  }

  getWidgets(dashboardId) {
    this.status.next('loading');
    this.widgetService.getWidgetsByDashboardId(dashboardId).subscribe(
      (widgets: Widget[]) => {
        this.widgets = widgets;
        this.widgetsChanged();
      },
      error => {
        this.error.next("Could not load widgets.");
        console.log('error in view service getWidgets: ' + error);
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
        this.error.next("Could not update widget.");
        console.log('error in view service updateWidget: ' + error);
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
        this.error.next("Could not add widgets.");
        console.log('Error in view service add widget: ' + error);
      }
    );
  }

  deleteWidget(widgetId) {
    this.status.next('loading');
    const index = this.getWidgetIndexById(widgetId);
    this.widgetService.deleteWidget(widgetId).subscribe(
      error => {
        this.error.next("Could not delete widgets.");
        console.log('error in view service deleteWidget: ' + error);
      }
    );
    this.widgets.splice(index, 1);
    this.widgetsChanged();
  }

  // TODO: does this actuall refresh data?
  refreshWidgets() {
    console.log('refresh!');
    this.widgetsChanged();
  }

  handleError(message) {
    this.error.next(message);
    this.status.next("error");
  }

  saveDashboard(dashboard: Dashboard) {
    this.dashboardService.updateDashboard(dashboard).subscribe(
      error => {
        this.error.next("Could not save dashboard.");
        console.log('error in view service save Dashboard: ' + error);
      }
    );
  }
  // save and refresh in here
}
