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

  widgets : Widget[];
  //handle refreshing

  constructor(
    private dashboardService : DashboardsService,
    private widgetService : WidgetsService,
    private measurementService : MeasurementsService
  ) { }

  getWidgetById(id) {
    // return widget
  }

  updateWidget(widget) {

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

  getWidgets(dashboardId) {
    this.widgetService.getWidgetsByDashboardId(dashboardId).subscribe(
      (widgets : Widget[]) => {
        this.currentWidgets.next(widgets);
      }
    )
  }



  refreshWidget() {

  }

  saveDashboard(){

  }
  //save and refresh in here
}
