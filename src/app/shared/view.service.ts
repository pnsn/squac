//service that actually has dashboard info -takes it out of component
//Handles communication between dashboard and widget

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Dashboard } from '../dashboards/dashboard';
import { Widget } from '../widgets/widget';
import { MeasurementsService } from '../widgets/measurements.service';
import { WidgetsService } from '../widgets/widgets.service';
import { DashboardsService } from '../dashboards/dashboards.service';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  currentDashboard = new Subject<Dashboard>();
  currentWidgets = new Subject<Widget[]>();
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
 
  dashboardSelected(id) {
    this.dashboardService.getDashboard(id).subscribe(
      dashboard => {
        this.currentDashboard.next(dashboard);
        this.getWidgets(dashboard.id);
      }
    )
  }

  getWidgets(dashboardId) {
    this.widgetService.getWidgetsByDashboardId(dashboardId).subscribe(
      (widgets : Widget[]) => {
        console.log(widgets)
        this.currentWidgets.next(widgets);
        console.log("got me widgets")
      }
    )
  }

  refreshWidget() {

  }

  saveDashboard(){

  }
  //save and refresh in here
}
