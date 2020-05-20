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
    this.widgets = [];
    this.updateCurrentWidgets();

    this.dashboardService.getDashboard(id).subscribe(
      dashboard => {
        this.currentDashboard.next(dashboard);
        this.getWidgets(dashboard.id);
      },
      error => {
        this.handleError("Could not load dashboard.", "dashboardSelected", error);
      },
      () => {
        console.log("dashboard complete")
      }
    );
  }

  // FIXME: this currently will cause all widgets to reload;
  private widgetsChanged() {
    this.updateCurrentWidgets();
    this.status.next('finished');
    this.error.next(null);
  }

  private updateCurrentWidgets(){
    this.currentWidgets.next(this.widgets.slice());
  }

  getWidgets(dashboardId) {
    this.status.next('loading');
    this.widgetService.getWidgetsByDashboardId(dashboardId).subscribe(
      (widgets: Widget[]) => {
        this.widgets = widgets;
        this.widgetsChanged();
      },
      error => {
        this.handleError("Could not load widgets.", "getWidgets", error);
      },
      () => {
        //no widgets for dashboard
        this.widgetsChanged();
        console.log("Get widgets done")
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
        this.handleError("Could not update widget.", "updateWidget", error);
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
        this.handleError("Could not add widgets.", "addWidget", error);
      }
    );
  }

  deleteWidget(widgetId) {
    this.status.next('loading');
    const index = this.getWidgetIndexById(widgetId);
    this.widgetService.deleteWidget(widgetId).subscribe(
      error => {
        this.handleError("Could not delete widgets.", "deleteWidget", error);
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

  handleError(message, source, error) {
    this.error.next(message);
    console.log("Error in view service" + source + ": " + error);
    this.status.next("error");
  }

  saveDashboard(dashboard: Dashboard) {
    this.dashboardService.updateDashboard(dashboard).subscribe(
      error => {
        this.handleError("Could not save dashboard.", "saveDashboard", error);
      }
    );
  }
  // save and refresh in here
}
