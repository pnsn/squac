import { Injectable } from '@angular/core';
import { ChannelGroup } from '../shared/channel-group';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { Channel } from '../shared/channel';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SquacApiService } from '../squacapi';

interface ChannelGroupsHttpData {
  name: string, 
  description: string,
  channels: string[],
  id?: number
}

//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class ChannelGroupsService extends SquacApiService{  
  getChannelGroups = new BehaviorSubject<ChannelGroup[]>([]);

  constructor(
     http : HttpClient
  ) {
    super("nslc/groups/", http);
  }

  private updateChannelGroups(channelGroups: ChannelGroup[]) {
    this.getChannelGroups.next(channelGroups);
  };

  // Gets channel groups from server
  fetchChannelGroups() : void {
    //temp 
    super.get().pipe(
      map(
        results => {
          let channelGroups : ChannelGroup[] = [];

          results.forEach(cG => {
            let chanGroup = new ChannelGroup(
              cG.id,
              cG.name,
              cG.description
            )
            channelGroups.push(chanGroup);
          });
          return channelGroups;
        }
      )
    )
    .subscribe(result => {
      this.updateChannelGroups(result);
    });
  }

  //Gets a specific channel group from server
  getChannelGroup(id: number) : Observable<ChannelGroup>{
            //temp 
      return super.get(id).pipe(
        map(
          result => {
            console.log("result ", result);
            let channelGroup : ChannelGroup;

            channelGroup = new ChannelGroup(
              result.id,
              result.name, 
              result.description
            )

            result.channels.forEach(channel => {
              let chan = new Channel(
                channel.id,
                channel.name,
                channel.code,
                channel.sample_rate,
                channel.lat,
                channel.lon,
                channel.elev,
                channel.loc
              );

              chan.stationId = channel.station;
              //FIXME - doesn't have station/network information
              channelGroup.channels.push(chan);
            });

            return channelGroup;
          }
        )
      )
  }

  updateChannelGroup(channelGroup: ChannelGroup) : Observable<ChannelGroup> {
    let postData : ChannelGroupsHttpData = {
      name: channelGroup.name,
      description: channelGroup.description,
      channels : channelGroup.channelsIdsArray
    }
    if(channelGroup.id) {
      postData.id = channelGroup.id;
    }
    return super.post(postData);
  }

}
