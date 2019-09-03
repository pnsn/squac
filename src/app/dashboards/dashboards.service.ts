import { Injectable } from '@angular/core';
import { Dashboard } from './dashboard';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { Widget } from './widget';
import { SquacApiService } from '../squacapi';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, concatMap, switchMap } from 'rxjs/operators';
import { ChannelGroupsService } from '../channel-groups/channel-groups.service';

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
  // private localDashboards
  getDashboards = new BehaviorSubject<Dashboard[]>([]);

  constructor(
    http : HttpClient,
    private channelGroupsService : ChannelGroupsService
  ) {
    super("dashboard/dashboards/", http);
  }

  private updateDashboards(dashboards: Dashboard[]) {
    this.getDashboards.next(dashboards);
  };

  // Gets channel groups from server
  fetchDashboards() : void {
    //temp 
    console.log("fetch dashboards")
    super.get().pipe(
      map(
        dashboards => {
          let _dashboards : Dashboard[] = [];

          dashboards.forEach(d => {
            let _dashboard = new Dashboard(
              d.id,
              d.name,
              d.description,
              d.group,
              d.widgets ? d.widgets : []
            )
            _dashboards.push(_dashboard);
          });
          return _dashboards;
        }
      )
    )
    .subscribe(dashboard => {
      this.updateDashboards(dashboard);
    });
  }

  // Gets dashboard by id from SQUAC
  getDashboard(id: number) : any{
    let _dashboard : Dashboard;
    return super.get(id).pipe(
      switchMap (
        dashboard => this.channelGroupsService.getChannelGroup(dashboard.group),
        ( dashboard, channelGroup ) => {
          _dashboard = new Dashboard(
            dashboard.id,
            dashboard.name, 
            dashboard.description,
            dashboard.group,
            dashboard.widgets
          )
          _dashboard.channelGroup = channelGroup;
          console.log(_dashboard);
          return _dashboard;

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
