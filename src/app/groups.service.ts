import { Injectable } from '@angular/core';
import { Group } from './shared/group';
import { Subject } from 'rxjs';

//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private groups: Group[] = [
    new Group(1, "group A"),
    new Group(2, "group B"),
    new Group(3, "group C"), 
  ];
  groupsChanged = new Subject<Group[]>();
  //in future get metrics from request;
  constructor() { }

  // private getIndexFromId(id: number) : number{
  //   for (let i=0; i < this.metrics.length; i++) {
  //     if (this.metrics[i].id === id) {
  //         return i;
  //     }
  //   }
  // }

  getGroups(){
    return this.groups.slice();
  }

  // getMetric(id: number) : Metric{
  //   let index = this.getIndexFromId(id);
  //   return this.metrics[index];
  // }

  // addMetric(name: String) { //can't know id yet
  // this.metricsChange();
  // };

  // updateMetric(id: number, metric: Metric) {
  //   let index = this.getIndexFromId(id);

  //   this.metrics[index] = new Metric(id, metric.name);
  //   console.log(this.metrics)
  //   this.metricsChange();
  // }

  private groupsChange(){
    this.groupsChanged.next(this.groups.slice());
  }
}
