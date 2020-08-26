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

  private updateDashboards(dashboards?: Dashboard[]) {
    if (dashboards) {
      this.localDashboards = dashboards;
    }
    // this.getDashboards.next(this.localDashboards);
  }

  // Gets channel groups from server
  getDashboards(): Observable<Dashboard[]> {
    // if(more than X minutes) {
      //return new
    // } else 
    // return stored
    //
    console.log(new Date().getTime(), this.lastRefresh + 5*60000)
    if(this.lastRefresh && new Date().getTime() > this.lastRefresh+ 5 * 60000) {
      return of(this.localDashboards);
    } else {
      return this.squacApi.get(this.url).pipe(
        map(
          response => {
            const dashboards: Dashboard[] = [];
  
            response.forEach(d => {
              const dashboard = new Dashboard(
                d.id,
                d.user_id,
                d.name,
                d.description,
                d.share_org,
                d.share_all,
                d.organization,
                d.widgets ? d.widgets : []
              );
              if (response.window_seconds) {
                dashboard.timeRange = response.window_seconds;
              } else {
                dashboard.starttime = response.starttime;
                dashboard.endtime = response.endtime;
              }
              dashboards.push(dashboard);
            });
            return dashboards;
          }
        ),
        tap(
          (dashboards : Dashboard[]) => {
            this.lastRefresh = new Date().getTime();
            this.updateDashboards(dashboards);
          }
        )
      );

    }

  }

  private updateLocalDashboard(id: number, dashboard?: Dashboard) {
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
  getDashboard(id: number): Observable<Dashboard> {
    //TODO: return local copy?
    return this.squacApi.get(this.url, id).pipe(map((data) => this.mapDashboard(data)));
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
