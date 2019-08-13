import { Injectable } from '@angular/core';
import { ChannelGroup } from './channel-group';
import { Subject, BehaviorSubject } from 'rxjs';
import { Channel } from './channel';

//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class ChannelGroupsService {
  testChannelArray = [
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
  ];
  private channelGroups: ChannelGroup[] = [
    new ChannelGroup(1, "channel group a", "channel group a description", this.testChannelArray),
    new ChannelGroup(2, "channel group b", "channel group b description", this.testChannelArray), 
    new ChannelGroup(3, "channel group c", "channel group c description", this.testChannelArray) 
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

  //http this stuff
  addChannelGroup(channelGroup: ChannelGroup) : number{ //can't know id yet
    //make id
    let newChannelGroup = new ChannelGroup(
      channelGroup.id,
      channelGroup.name,
      channelGroup.description,
      channelGroup.channels
    )
    this.channelGroups.push(newChannelGroup);
    this.channelGroupsChange();

    return this.channelGroups.length; //return ID
  };

  //TODO: check if dangerous due to same group reference
  updateChannelGroup(id: number, channelGroup: ChannelGroup) : number{
    if(id) {
      let index = this.getIndexFromId(id);
      this.channelGroups[index] = channelGroup; 
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
