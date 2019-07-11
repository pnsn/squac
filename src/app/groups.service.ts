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

  private getIndexFromId(id: number) : number{
    for (let i=0; i < this.groups.length; i++) {
      if (this.groups[i].id === id) {
          return i;
      }
    }
  }

  getGroups(){
    return this.groups.slice();
  }

  getGroup(id: number) : Group{
    let index = this.getIndexFromId(id);
    return this.groups[index];
  }

  addGroup(name: String) { //can't know id yet
    this.groupsChange();
  };

  updateGroup(id: number, group: Group) {
    let index = this.getIndexFromId(id);

    this.groups[index] = new Group(id, group.name);
    this.groups[index].updateMetrics(group.metrics);
    console.log(this.groups)

    this.groupsChange();
  }

  private groupsChange(){
    this.groupsChanged.next(this.groups.slice());
  }
}
