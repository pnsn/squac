import { Injectable } from '@angular/core';
import { Dashboard } from './dashboard';
import { Subject, BehaviorSubject, Observable, of, empty } from 'rxjs';
import { Widget } from '../widgets/widget';
import { SquacApiService } from '../squacapi.service';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, concatMap, switchMap, tap } from 'rxjs/operators';
import { ChannelGroupsService } from '../channel-groups/channel-groups.service';
import { WidgetsService } from '../widgets/widgets.service';

interface DashboardsHttpData {
  name: string;
  description: string;
  is_public: boolean;
  widgets: any;
  id?: number;
}
// should I use index or id
@Injectable({
  providedIn: 'root'
})
export class DashboardsService {
  // private localDashboards
  localDashboards: Dashboard[] = [];
  getDashboards = new BehaviorSubject<Dashboard[]>([]);
  private url = 'dashboard/dashboards/';
  constructor(
    private channelGroupsService: ChannelGroupsService,
    private widgetsService: WidgetsService,
    private squacApi: SquacApiService
  ) {
  }

  private updateDashboards(dashboards?: Dashboard[]) {
    if (dashboards) {
      this.localDashboards = dashboards;
    }
    this.getDashboards.next(this.localDashboards);
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
              d.user_id,
              d.name,
              d.description,
              d.is_public,
              d.widgets ? d.widgets : []
            );
            dashboards.push(dashboard);
          });
          return dashboards;
        }
      )
    )
    .subscribe(
      dashboards => {
        this.updateDashboards(dashboards);
      },
      error => {
        console.log('error in dashboards: ' + error);
      }
    );
  }

  private updateLocalDashboards(id: number, dashboard?: Dashboard) {
    const index = this.localDashboards.findIndex(d => d.id === id);

    if (index > -1) {
      if (dashboard) {
        this.localDashboards[index] = dashboard;

      } else {
        this.localDashboards.splice(index, 1);
      }
    } else {
      this.localDashboards.push(dashboard);
    }
    this.updateDashboards();
  }

  // Gets dashboard by id from SQUAC
  getDashboard(id: number): any {
    return this.squacApi.get(this.url, id).pipe(map((data) => this.mapDashboard(data)));
  }

  updateDashboard(dashboard: Dashboard): Observable<Dashboard> {
    const postData: DashboardsHttpData = {
      name: dashboard.name,
      description: dashboard.description,
      is_public: dashboard.isPublic,
      widgets: dashboard.widgetIds
    };
    if (dashboard.id) {
      postData.id = dashboard.id;
      return this.squacApi.put(this.url, dashboard.id, postData).pipe(
        map((data) => this.mapDashboard(data))
      );
    } else {
      return this.squacApi.post(this.url, postData).pipe(
          map((data) => this.mapDashboard(data))
        );
    }

  }

  private mapDashboard(squacData): Dashboard {
    const dashboard = new Dashboard(
      squacData.id,
      squacData.user_id,
      squacData.name,
      squacData.description,
      squacData.is_public,
      squacData.widgets
    );
    this.updateLocalDashboards(dashboard.id, dashboard);
    return dashboard;
  }

  deleteDashboard(dashboardId): Observable<any> {
    this.updateLocalDashboards(dashboardId);
    return this.squacApi.delete(this.url, dashboardId);
  }
}
