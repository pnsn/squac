import { Injectable } from '@angular/core';
import { MetricGroup } from './metric-group';
import { Subject } from 'rxjs';
import { Metric } from './metric';

//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class MetricGroupsService {
  private metricGroups: MetricGroup[] = [
    new MetricGroup(0, "metric a", "metric a description", []),
    new MetricGroup(1, "metric b", "metric b description", []), 
    new MetricGroup(2, "metric c", "metric c description", []) 
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

  getMetricGroup(id: number) : MetricGroup {

    let index = this.getIndexFromId(id);
    console.log(this.metricGroups, id)
    return this.metricGroups[index];
  }

  addMetricGroup(metricGroup: MetricGroup) : number { //can't know id yet
    this.metricGroups.push(metricGroup);
    this.metricGroupsChange();

    return this.metricGroups.length;
  };

  updateMetricGroup(id: number, metricGroup: MetricGroup, metrics: Metric[]) : number {
    //make up ID here

    if(id) {
      let index = this.getIndexFromId(id);
      metricGroup.id = id;
      this.metricGroups[index] = metricGroup;
      this.metricGroupsChange();
    } else {
      metricGroup.id = this.metricGroups.length + 1;
      return this.addMetricGroup(metricGroup);
    }
    this.metricGroupsChange();
  }

  private metricGroupsChange(){
    this.metricGroupsChanged.next(this.metricGroups.slice());
  }
}
