import { Injectable } from '@angular/core';
import { ChannelGroup } from './channel-group';
import { Subject } from 'rxjs';
import { Channel } from './channel';

//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class ChannelGroupsService {
  testChannelArray = [
    {
      "chaName": "EHZ",
      "cha": "ehz",
      "sample_rate": -1,
      "lat": 46.08924,
      "lon": -123.45173,
      "elev": 826,
      "loc": "--",
      "staName": "Nicolai Mt., Oregon",
      "sta": "nlo",
      "net": "uw",
      "netName": "University of Washington",
      "nslc" : "uw.nlo.--.ehz"
    },
    {
      "chaName": "EHZ",
      "cha": "ehz",
      "sample_rate": -1,
      "lat": 45.83878,
      "lon": -120.81479,
      "elev": 610,
      "loc": "--",
      "staName": "Goldendale Observatory, WA, USA",
      "sta": "gldo",
      "net": "uw",
      "netName": "University of Washington",
      "nslc": "uw.gldo.--.ehz"
    }
  ];
  private channelGroups: ChannelGroup[] = [
    new ChannelGroup(1, "channel group a", "description", this.testChannelArray),
    new ChannelGroup(2, "channel group b", "description", this.testChannelArray), 
    new ChannelGroup(3, "channel group c", "description", this.testChannelArray) 
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
    this.channelGroups.push(new ChannelGroup(this.channelGroups.length, channelGroup.name, channelGroup.description));
    this.channelGroupsChange();

    return this.channelGroups.length;
  };

  updateChannelGroup(id: number, channelGroup: ChannelGroup, channels: Channel[]) : number{
    if(id) {
      let index = this.getIndexFromId(id);
      this.channelGroups[index] = new ChannelGroup(id, channelGroup.name, channelGroup.description, channels);
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
