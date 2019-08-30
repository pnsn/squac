import { Injectable } from '@angular/core';
import { Dashboard } from './dashboard';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { Widget } from './widget';
import { SquacApiService } from '../squacapi';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
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

  getDashboard(id: number) : Observable<Dashboard>{
    //temp 
    return super.get(id).pipe(
      map(
        dashboard => {
          let _dashboard = new Dashboard(
              dashboard.id,
              dashboard.name,
              dashboard.description,
              dashboard.group,
              dashboard.widgets
          );
          
          this.channelGroupsService.getChannelGroup(dashboard.group).subscribe(
            channelGroup => {
              _dashboard.channelGroup = channelGroup;
            }
          )

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
