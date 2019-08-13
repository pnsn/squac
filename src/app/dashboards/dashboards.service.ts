import { Injectable } from '@angular/core';
import { Dashboard } from './dashboard';
import { Subject } from 'rxjs';
import { ChannelGroup } from '../shared/channel-group';
import { Channel } from '../shared/channel';
import { Widget } from './widget';

//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class DashboardsService {
  private dashboards: Dashboard[] = [
    new Dashboard(
      1, 
      "dashboard A", 
      "description",
      [],
      [],
      new ChannelGroup(1, "channel group a", "channel group a description", [
        new Channel(
          "EHZ",
          "ehz",
          -1,
          46.08924,
          -123.45173,
          826,
          "--",
          "Nicolai Mt., Oregon",
          "nlo",
          "uw",
          "University of Washington"
        ),
        new Channel(
          "EHZ",
          "ehz",
           -1,
          45.83878,
          -120.81479,
          610,
          "--",
          "Goldendale Observatory, WA, USA",
          "gldo",
          "uw",
          "University of Washington",
        )
      ]),
    )
  ];
  dashboardsChanged = new Subject<Dashboard[]>();

  constructor() { }

  private getIndexFromId(id: number) : number{
    for (let i=0; i < this.dashboards.length; i++) {
      if (this.dashboards[i].id === id) {
          return i;
      }
    }
  }

  getDashboards(){
    return this.dashboards.slice();
  }

  getDashboard(id: number) : Dashboard{
    let index = this.getIndexFromId(id);
    return this.dashboards[index];
  }

  addDashboard(dashboard: Dashboard) : number { //can't know id yet
    //figure out ID
    let newDashboard = new Dashboard(
      dashboard.id,
      dashboard.name,
      dashboard.description,
      dashboard.widgets,
      dashboard.metrics,
      dashboard.channelGroup
    )
    this.dashboards.push(newDashboard);
    this.dashboardsChange();
    console.log(this.dashboards)
    return this.dashboards.length - 1; //return ID
  };

  updateDashboard(id: number, dashboard: Dashboard) : number {
    if (id) {
      let index = this.getIndexFromId(id);
      this.dashboards[index] = dashboard;
      this.dashboardsChange();
    } else {
      return this.addDashboard(dashboard);
    }
  }

  private dashboardsChange(){
    this.dashboardsChanged.next(this.dashboards.slice());
  }
}
