import { Injectable } from '@angular/core';
import { Group } from './shared/group';
import { Subject } from 'rxjs';

//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private groups: Group[] = [
    new Group(12398724, "group A"),
    new Group(2232437, "group B"),
    new Group(3131242, "group C"), 
  ];
  groupsChanged = new Subject<Group[]>();

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

  addGroup(group: Group) : number{ //can't know id yet
    this.groups.push(new Group(this.groups.length, group.name, group.metricGroups));
    this.groupsChange();
    console.log(this.groups)
    return this.groups.length - 1;
  };

  updateGroup(id: number, group: Group) : number {
    if (id) {
      let index = this.getIndexFromId(id);
      this.groups[index] = new Group(id, group.name, group.metricGroups);
      this.groupsChange();
    } else {
      return this.addGroup(group);
    }
  }

  private groupsChange(){
    this.groupsChanged.next(this.groups.slice());
  }
}
