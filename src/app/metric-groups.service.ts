import { Injectable } from '@angular/core';
import { MetricGroup } from './shared/metric-group';
import { Subject } from 'rxjs';

//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class MetricGroupsService {
  private metricGroups: MetricGroup[] = [
    new MetricGroup(1, "metric a"),
    new MetricGroup(2, "metric b"), 
    new MetricGroup(3, "metric c") 
  ];
  metricGroupsChanged = new Subject<MetricGroup[]>();

  constructor() { }

  private getIndexFromId(id: number) : number{
    for (let i=0; i < this.metricGroups.length; i++) {
      if (this.metricGroups[i].id === id) {
          return i;
      }
    }
  }

  getMetricGroups(){
    return this.metricGroups.slice();
  }

  getMetricGroup(id: number) : MetricGroup{
    let index = this.getIndexFromId(id);
    return this.metricGroups[index];
  }

  addMetricGroup(metricGroup: MetricGroup) : number{ //can't know id yet
    this.metricGroups.push(new MetricGroup(this.metricGroups.length, metricGroup.name));
    this.metricGroupsChange();

    return this.metricGroups.length;
  };

  updateMetricGroup(id: number, metricGroup: MetricGroup) : number{
    if(id) {
      let index = this.getIndexFromId(id);
      this.metricGroups[index] = new MetricGroup(id, metricGroup.name);
      this.metricGroupsChange();
    } else {
      return this.addMetricGroup(metricGroup);
    }
    this.metricGroupsChange();
  }

  private metricGroupsChange(){
    this.metricGroupsChanged.next(this.metricGroups.slice());
  }
}
