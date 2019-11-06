//service that actually has dashboard info -takes it out of component
//Handles communication between dashboard and widget

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
  dates = new Subject<{start:Date, end:Date}>();
  private channelGroup : ChannelGroup;
  private startdate : Date;
  private enddate: Date;
  // refresh = new Subject<number>();

  private widgets : Widget[];
  //handle refreshing

  constructor(
    private dashboardService : DashboardsService,
    private widgetService : WidgetsService,
    private measurementService : MeasurementsService
  ) { }

  private getWidgetIndexById(id : number) : number {
    for (let widgetIndex in this.widgets) {
      if(this.widgets[widgetIndex].id === id) {
        return +widgetIndex;
      }
    }
  }

  getChannelGroup() {
    return this.channelGroup;
  }

  getStartdate() {
    return this.startdate;
  }

  getEnddate(){
    return this.enddate;
  }
 
  datesChanged(start : Date, end : Date) {
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
    this.dashboardService.getDashboard(id).subscribe(
      dashboard => {
        this.currentDashboard.next(dashboard);
        this.getWidgets(dashboard.id);

        this.channelGroup = dashboard.channelGroup;
      }
    )
  }

  //FIXME: this currently will cause all widgets to reload;
  private widgetsChanged(){
    this.currentWidgets.next(this.widgets.slice());
  }

  getWidgets(dashboardId) {
    this.widgetService.getWidgetsByDashboardId(dashboardId).subscribe(
      (widgets : Widget[]) => {
        this.widgets = widgets;
        console.log(this.widgets);
        console.log(this.getWidgetIndexById(2));
        this.widgetsChanged();
      }
    )
  }

  updateWidget(widgetId) {
    this.widgetService.getWidget(widgetId).subscribe(
      (widget : Widget) => {
        const index = this.getWidgetIndexById(widget.id);

        this.widgets[index]=widget;
        this.widgetsChanged();
      }
    )
  }

  addWidget(widgetId) {
    this.widgetService.getWidget(widgetId).subscribe(
      (widget : Widget) => {
        this.widgets.push(widget);
        this.widgetsChanged();
      }
    )
  }

  deleteWidget(widgetId) {
    const index = this.getWidgetIndexById(widgetId);
    this.widgetService.deleteWidget(widgetId).subscribe();
    this.widgets.splice(index, 1);
    this.widgetsChanged();
  }

  refreshWidgets() {
    console.log("refresh!")
    this.widgetsChanged();
  }

  saveDashboard(){

  }
  //save and refresh in here
}