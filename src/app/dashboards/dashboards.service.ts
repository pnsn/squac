import { Injectable } from '@angular/core';
import { Dashboard } from './dashboard';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { Widget } from './widget';
import { SquacApiService } from '../squacapi';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

interface DashboardsHttpData {
  name: string,
  description: string,
  group: number, 
  widgets: any,
  id?: number
}
//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class DashboardsService extends SquacApiService{

  getDashboards = new BehaviorSubject<Dashboard[]>([]);

  constructor(
    http : HttpClient
  ) {
    super("dashboard/dashboards/", http);
  }

  private updateDashboards(dashboards: Dashboard[]) {
    this.getDashboards.next(dashboards);
  };

  // Gets channel groups from server
  fetchDashboards() : void {
    //temp 
    super.get().pipe(
      map(
        results => {
          let dashboards : Dashboard[] = [];

          results.forEach(d => {
            let dashboard = new Dashboard(
              d.id,
              d.name,
              d.description,
              d.group,
              d.widgets
            )
            dashboards.push(dashboard);
          });
          return dashboards;
        }
      )
    )
    .subscribe(result => {
      this.updateDashboards(result);
    });
  }

  getDashboard(id: number) : Observable<Dashboard>{
    //temp 
    return super.get(id).pipe(
      map(
        result => {
          let dashboard = new Dashboard(
              result.id,
              result.name,
              result.description,
              result.group,
              result.widgets
          );
          return dashboard;
        }
      )
    );
  }

  updateDashboard(dashboard: Dashboard) : Observable<Dashboard> {
    let postData : DashboardsHttpData = {
      name: dashboard.name,
      description: dashboard.description,
      group: dashboard.channelGroupId,
      widgets: dashboard.widgets
    }
    if(dashboard.id) {
      postData.id = dashboard.id;
    }
    return super.post(postData);
  }
}
