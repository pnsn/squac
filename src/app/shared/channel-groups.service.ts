import { Injectable } from '@angular/core';
import { ChannelGroup } from './channel-group';
import { Subject } from 'rxjs';

//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class ChannelGroupsService {
  private channelGroups: ChannelGroup[] = [
    new ChannelGroup(1, "channel group a", "description"),
    new ChannelGroup(2, "channel group b", "description"), 
    new ChannelGroup(3, "channel group c", "description") 
  ];
  channelGroupsChanged = new Subject<ChannelGroup[]>();

  constructor() { }

  private getIndexFromId(id: number) : number{
    for (let i=0; i < this.channelGroups.length; i++) {
      if (this.channelGroups[i].id === id) {
          return i;
      }
    }
  }

  getChannelGroups(){
    return this.channelGroups.slice();
  }

  getChannelGroup(id: number) : ChannelGroup{
    let index = this.getIndexFromId(id);
    return this.channelGroups[index];
  }

  addChannelGroup(channelGroup: ChannelGroup) : number{ //can't know id yet
    this.channelGroups.push(new ChannelGroup(this.channelGroups.length, channelGroup.name, channelGroup.description));
    this.channelGroupsChange();

    return this.channelGroups.length;
  };

  updateChannelGroup(id: number, channelGroup: ChannelGroup) : number{
    if(id) {
      let index = this.getIndexFromId(id);
      this.channelGroups[index] = new ChannelGroup(id, channelGroup.name, channelGroup.description);
      this.channelGroupsChange();
    } else {
      return this.addChannelGroup(channelGroup);
    }
    this.channelGroupsChange();
  }

  private channelGroupsChange(){
    this.channelGroupsChanged.next(this.channelGroups.slice());
  }
}
