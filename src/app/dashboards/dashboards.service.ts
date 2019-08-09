import { Injectable } from '@angular/core';
import { Dashboard } from './dashboard';
import { Subject } from 'rxjs';

//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class DashboardsService {
  private dashboards: Dashboard[] = [
    new Dashboard(12398724, "dashboard A"),
    new Dashboard(2232437, "dashboard B"),
    new Dashboard(3131242, "dashboard C"), 
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

  addDashboard(dashboard: Dashboard) : number{ //can't know id yet
    this.dashboards.push(new Dashboard(this.dashboards.length, dashboard.name));
    this.dashboardsChange();
    console.log(this.dashboards)
    return this.dashboards.length - 1;
  };

  updateDashboard(id: number, dashboard: Dashboard) : number {
    if (id) {
      let index = this.getIndexFromId(id);
      this.dashboards[index] = new Dashboard(id, dashboard.name);
      this.dashboardsChange();
    } else {
      return this.addDashboard(dashboard);
    }
  }

  private dashboardsChange(){
    this.dashboardsChanged.next(this.dashboards.slice());
  }
}
