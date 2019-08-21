import { Injectable } from '@angular/core';
import { ChannelGroup } from '../shared/channel-group';
import { Subject, BehaviorSubject } from 'rxjs';
import { Channel } from '../shared/channel';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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
  
  private channelGroups: ChannelGroup[] = [];

  channelGroupsChanged = new Subject<ChannelGroup[]>();

  constructor(private http : HttpClient) { }

  private getIndexFromId(id: number) : number{
    for (let i=0; i < this.channelGroups.length; i++) {
      if (this.channelGroups[i].id === id) {
          return i;
      }
    }
  }

  getChannelGroupsFromServer() {
    //temp 
    this.http.get<any>(
      'https://squac.pnsn.org/v1.0/nslc/groups/'
    ).pipe(
      map(
        results => {
          let channelGroups : ChannelGroup[] = [];
          results.forEach(cG => {
            let chanGroup = new ChannelGroup(
              cG.id,
              cG.name,
              cG.description,
              []
            )
            channelGroups.push(chanGroup);
          });
          return channelGroups;
        }
      ),
      tap( channelGroups => {
        this.channelGroups.push(...channelGroups);
      })
    )
    .subscribe(result => {
      console.log(result)
      console.log(this.channelGroups)
    });
  }

  getChannelGroups(){
    return this.channelGroups.slice();
  }

  getChannelGroup(id: number) : ChannelGroup{
    let index = this.getIndexFromId(id);
    return this.channelGroups[index];
  }

  //temp: just until JOn gets this db going
  private generateID() : number{
    return this.channelGroups.length + 1; 
  }
  

  //http this stuff
  addChannelGroup(channelGroup: ChannelGroup) : number{ //can't know id yet
    //make id
    let id = this.generateID();
    let newChannelGroup = new ChannelGroup(
      id,
      channelGroup.name,
      channelGroup.description,
      channelGroup.channels
    )
    this.channelGroups.push(newChannelGroup);
    this.channelGroupsChange();


    //temp 
    this.http.post<any>(
      'https://squac.pnsn.org/v1.0/nslc/groups/',
      {
        "name" : channelGroup.name,
        "description" : channelGroup.description
      }
    ).subscribe(result => {
      console.log(result)
    });

    return id; //return ID
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
