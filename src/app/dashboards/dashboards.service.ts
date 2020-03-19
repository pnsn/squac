import { Injectable } from '@angular/core';
import { Dashboard } from './dashboard';
import { Subject, BehaviorSubject, Observable, of, empty } from 'rxjs';
import { Widget } from '../widgets/widget';
import { SquacApiService } from '../squacapi.service';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, concatMap, switchMap } from 'rxjs/operators';
import { ChannelGroupsService } from '../channel-groups/channel-groups.service';
import { WidgetsService } from '../widgets/widgets.service';

interface DashboardsHttpData {
  name: string;
  description: string;
  widgets: any;
  id?: number;
}
// should I use index or id
@Injectable({
  providedIn: 'root'
})
export class DashboardsService {
  // private localDashboards
  getDashboards = new BehaviorSubject<Dashboard[]>([]);
  private url = 'dashboard/dashboards/';
  constructor(
    private channelGroupsService: ChannelGroupsService,
    private widgetsService: WidgetsService,
    private squacApi: SquacApiService
  ) {
  }

  private updateDashboards(dashboards: Dashboard[]) {
    this.getDashboards.next(dashboards);
  }

  // Gets channel groups from server
  fetchDashboards(): void {

    this.squacApi.get(this.url).pipe(
      map(
        response => {
          const dashboards: Dashboard[] = [];

          response.forEach(d => {
            const dashboard = new Dashboard(
              d.id,
              d.name,
              d.description,
              d.widgets ? d.widgets : []
            );
            dashboards.push(dashboard);
          });
          return dashboards;
        }
      )
    )
    .subscribe(
      dashboard => {
        this.updateDashboards(dashboard);
      },
      error => {
        console.log("error in dashboards: " + error)
      }
    );
  }

  // Gets dashboard by id from SQUAC
  getDashboard(id: number): any {
    let dashboard: Dashboard;

    return this.squacApi.get(this.url, id).pipe(
      map (
        (response) => {
          dashboard = new Dashboard(
            response.id,
            response.name,
            response.description,
            response.widgets
          );
          return dashboard;
        }
      )
    );
  }

  updateDashboard(dashboard: Dashboard): Observable<Dashboard> {
    const postData: DashboardsHttpData = {
      name: dashboard.name,
      description: dashboard.description,
      widgets: dashboard.widgetIds
    };
    if (dashboard.id) {
      postData.id = dashboard.id;
      return this.squacApi.put(this.url, dashboard.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }

  }

  deleteDashboard(dashboardId): Observable<any> {
    return this.squacApi.delete(this.url, dashboardId);
  }
}
