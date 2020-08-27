import { Injectable } from '@angular/core';
import { Dashboard } from '../models/dashboard';
import { BehaviorSubject, Observable, of} from 'rxjs';
import { SquacApiService } from '@core/services/squacapi.service';
import { map, tap} from 'rxjs/operators';

interface DashboardsHttpData {
  name: string;
  description: string;
  share_all: boolean;
  share_org: boolean;
  widgets?: any;
  organization: number;
  window_seconds?: number;
  starttime?: string;
  endtime?: string;
  id?: number;
}
// should I use index or id
@Injectable({
  providedIn: 'root'
})
export class DashboardsService {
  private lastRefresh: number;
  // private localDashboards
  localDashboards: Dashboard[] = [];
  // getDashboards = new BehaviorSubject<Dashboard[]>([]);
  private url = 'dashboard/dashboards/';
  constructor(
    private squacApi: SquacApiService
  ) {
  }

  // Gets channel groups from server
  getDashboards(): Observable<Dashboard[]> {
    console.log(new Date().getTime(), this.lastRefresh + 5*60000)
    if(this.lastRefresh && new Date().getTime() < this.lastRefresh+ 5 * 60000) {
      console.log("return local dashboards")
      return of(this.localDashboards);
    } else {
      return this.squacApi.get(this.url).pipe(
        map(
          response => {
            const dashboards: Dashboard[] = [];
            for (let dashboard of response) {
              dashboards.push(this.mapDashboard(dashboard));
            }

            return dashboards;
          }
        ),
        tap(
          (dashboards : Dashboard[]) => {
            this.lastRefresh = new Date().getTime();
          }
        )
      );

    }

  }

  private updateLocalDashboard(id: number, dashboard?: Dashboard) {
    const index = this.localDashboards.findIndex(d => d.id === id);

    if (index && index > -1) {
      if (dashboard) {
        this.localDashboards[index] = dashboard;

      } else {
        this.localDashboards.splice(index, 1);
      }
    } else {
      this.localDashboards.push(dashboard);
    }
  }

  // Gets dashboard by id from SQUAC
  getDashboard(id: number): Observable<Dashboard> {
    console.log(this.localDashboards)
    const index = this.localDashboards.findIndex(d => d.id === id);
    if (index && index > -1) {
      console.log("return local dashboard")
      return of(this.localDashboards[index]);
    } else {
      return this.squacApi.get(this.url, id).pipe(map((data) => this.mapDashboard(data)));
    }

  }

  updateDashboard(dashboard: Dashboard): Observable<Dashboard> {
    const postData: DashboardsHttpData = {
      name: dashboard.name,
      description: dashboard.description,
      share_org: dashboard.shareOrg,
      share_all: dashboard.shareAll,
      starttime: dashboard.starttime,
      endtime: dashboard.endtime,
      organization: dashboard.orgId,
      window_seconds: dashboard.timeRange
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
      squacData.share_org,
      squacData.share_all,
      squacData.organization,
      squacData.widgets
    );
    if (squacData.window_seconds) {
      dashboard.timeRange = squacData.window_seconds;
    } else {
      dashboard.starttime = squacData.starttime;
      dashboard.endtime = squacData.endtime;
    }
    this.updateLocalDashboard(dashboard.id, dashboard);
    return dashboard;
  }

  deleteDashboard(dashboardId): Observable<any> {
    this.updateLocalDashboard(dashboardId);
    return this.squacApi.delete(this.url, dashboardId);
  }
}
