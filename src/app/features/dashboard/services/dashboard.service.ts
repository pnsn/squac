import { Injectable } from "@angular/core";
import { Dashboard, DashboardAdapter } from "@dashboard/models/dashboard";
import { Observable, of } from "rxjs";
import { SquacApiService } from "@core/services/squacapi.service";
import { map, tap } from "rxjs/operators";

// should I use index or id
@Injectable({
  providedIn: "root",
})
export class DashboardService {
  // Squacapi route for dashboards
  private url = "dashboard/dashboards/";
  // Time stamp for last full dashboard refresh
  private lastRefresh: number;

  // Local copy of dashboards
  private localDashboards: Dashboard[] = [];

  constructor(
    private squacApi: SquacApiService,
    private dashboardAdapter: DashboardAdapter
  ) {}

  // Get all dashboards viewable by user from squac
  getDashboards(): Observable<Dashboard[]> {
    // Fetch new dashboards if > 5 minutes since refresh
    if (
      this.lastRefresh &&
      new Date().getTime() < this.lastRefresh + 5 * 60000
    ) {
      return of(this.localDashboards);
    } else {
      return this.squacApi.get(this.url).pipe(
        map((results) =>
          results.map((r) => {
            const dashboard = this.dashboardAdapter.adaptFromApi(r);
            this.updateLocalDashboards(dashboard.id, dashboard);
            return dashboard;
          })
        ),
        tap(() => {
          this.lastRefresh = new Date().getTime();
        })
      );
    }
  }

  // Gets dashboard by id from SQUAC
  getDashboard(id: number): Observable<Dashboard> {
    // Fetch new dashboards if > 5 minutes since refresh
    return this.squacApi.get(this.url, id).pipe(
      map((response) => this.dashboardAdapter.adaptFromApi(response)),
      tap((dashboard) => this.updateLocalDashboards(dashboard.id, dashboard))
    );
  }

  // Post/Put dashboard to squac
  updateDashboard(dashboard: Dashboard): Observable<Dashboard> {
    const postData = this.dashboardAdapter.adaptToApi(dashboard);
    if (dashboard.id) {
      return this.squacApi.put(this.url, dashboard.id, postData).pipe(
        map((response) => this.dashboardAdapter.adaptFromApi(response)),
        tap((dashboard) => this.updateLocalDashboards(dashboard.id, dashboard))
      );
    } else {
      return this.squacApi.post(this.url, postData).pipe(
        map((response) => this.dashboardAdapter.adaptFromApi(response)),
        tap((dashboard) => this.updateLocalDashboards(dashboard.id, dashboard))
      );
    }
  }

  // Delete dashboard from squac
  deleteDashboard(dashboardId: number): Observable<any> {
    this.updateLocalDashboards(dashboardId);
    return this.squacApi.delete(this.url, dashboardId);
  }

  // Save/delete/replace changed dashboard in local storage
  private updateLocalDashboards(id: number, dashboard?: Dashboard): void {
    const index = this.localDashboards.findIndex((d) => d.id === id);

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
}
