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
  channelGroups = new Subject<ChannelGroup[]>();

  private localGroups : ChannelGroup[] = [];
  constructor(private http : HttpClient) { }

  private getChannelGroupFromId(id: number) : ChannelGroup{
    for (let i=0; i < this.localGroups.length; i++) {
      if (this.localGroups[i].id === id) {
          return this.localGroups[i];
      }
    }
  }

  fetchChannelGroups() {
    //temp 
    this.http.get<any>(
      'https://squac.pnsn.org/v1.0/nslc/groups/'
    ).pipe(
      map(
        results => {
          let channelGroups : ChannelGroup[] = [];
          console.log(results)
          results.forEach(cG => {
            let chanGroup = new ChannelGroup(
              cG.id,
              cG.name,
              cG.description,
              cG.channels //TODO: channels are in weird type
            )
            channelGroups.push(chanGroup);
          });
          return channelGroups;
        }
      )
    )
    .subscribe(channelGroups => {
      this.channelGroups.next(channelGroups);
      this.localGroups = channelGroups;
    });
  }

  getChannelGroup(id: number) : ChannelGroup{
    console.log(this.getChannelGroupFromId(id))
    return this.getChannelGroupFromId(id);
  }

  //http this stuff
  addChannelGroup(channelGroup: ChannelGroup) { //can't know id yet
    //temp 
    this.http.post<any>(
      'https://squac.pnsn.org/v1.0/nslc/groups/',
      {
        "name" : channelGroup.name,
        "description" : channelGroup.description,
        "channels" : channelGroup.channelsIdsArray
      }
    ).subscribe(result => {
      console.log(result)
      this.fetchChannelGroups();
    });

  };

  //TODO: check if dangerous due to same group reference
  updateChannelGroup(id: number, channelGroup: ChannelGroup){
    if(id) {

      //figure out updating
      // let index = this.getIndexFromId(id);
      // this.channelGroups[index] = channelGroup; 
      // this.channelGroupsChange();
    } else {
      this.addChannelGroup(channelGroup);
    }
  }

  private channelGroupsChange(){
    // this.channelGroupsChanged.next(this.channelGroups.slice());
  }
}
