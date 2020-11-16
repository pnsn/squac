import { Injectable } from '@angular/core';
import { Dashboard } from '../models/dashboard';
import { BehaviorSubject, Observable, of} from 'rxjs';
import { SquacApiService } from '@core/services/squacapi.service';
import { filter, map, tap} from 'rxjs/operators';

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
  // Squacapi route for dashboards
  private url = 'dashboard/dashboards/';
  // Time stamp for last full dashboard refresh
  private lastRefresh: number;

  // Local copy of dashboards
  private localDashboards: Dashboard[] = [];

  constructor(
    private squacApi: SquacApiService
  ) {
  }

  // Get all dashboards viewable by user from squac
  getDashboards(): Observable<Dashboard[]> {

    // Fetch new dashboards if > 5 minutes since refresh
    if (this.lastRefresh && new Date().getTime() < this.lastRefresh + 5 * 60000) {
      return of(this.localDashboards);
    } else {
      return this.squacApi.get(this.url).pipe(
        map(
          response => {
            const dashboards: Dashboard[] = [];
            for (const dashboard of response) {
              dashboards.push(this.mapDashboard(dashboard));
            }

            return dashboards;
          }
        ),
        tap(
          (dashboards: Dashboard[]) => {
            this.lastRefresh = new Date().getTime();
          }
        )
      );

    }

  }

  // Gets dashboard by id from SQUAC
  getDashboard(id: number): Observable<Dashboard> {
    return this.squacApi.get(this.url, id).pipe(map(data => this.mapDashboard(data)));
  }

  // Post/Put dashboard to squac
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
        map(data => this.mapDashboard(data))
      );
    } else {
      return this.squacApi.post(this.url, postData).pipe(
          map(data => this.mapDashboard(data))
        );
    }

  }

  // Delete dashboard from squac
  deleteDashboard(dashboardId: number ): Observable<any> {
    this.updateLocalDashboards(dashboardId);
    return this.squacApi.delete(this.url, dashboardId);
  }

  // Save/delete/replace changed dashboard in local storage
  private updateLocalDashboards(id: number, dashboard?: Dashboard): void {
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
  }

  // Map squac dashboard to dashboard object
  private mapDashboard(squacData): Dashboard {

    const dashboard = new Dashboard(
      squacData.id,
      squacData.user_id,
      squacData.name,
      squacData.description,
      squacData.share_org,
      squacData.share_all,
      squacData.organization,
      squacData.widgets ? squacData.widgets : []
    );
    if (squacData.window_seconds) {
      dashboard.timeRange = squacData.window_seconds;
    } else {
      dashboard.starttime = squacData.starttime;
      dashboard.endtime = squacData.endtime;
    }
    this.updateLocalDashboards(dashboard.id, dashboard);
    return dashboard;
  }


}
