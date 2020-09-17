import { Injectable } from '@angular/core';
import { ChannelGroup } from '@core/models/channel-group';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { Channel } from '@core/models/channel';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SquacApiService } from '@core/services/squacapi.service';

// Describes format of post data
interface ChannelGroupsHttpData {
  name: string;
  description: string;
  channels: number[];
  share_org: boolean;
  share_all: boolean;
  id?: number;
}

// should I use index or id
@Injectable({
  providedIn: 'root'
})
export class ChannelGroupsService {
  localChannelGroups: ChannelGroup[] = []; // Will want to store temporarily (redo on save?)
  lastRefresh: number;
  private url = 'nslc/groups/';
  constructor(
    private squacApi: SquacApiService
  ) {
  }

  // private updateChannelGroups(channelGroups: ChannelGroup[]) {
  //   this.getChannelGroups.next(channelGroups);
  // }



  // Gets channel groups from server
  getChannelGroups(): Observable<ChannelGroup[]> {
    if(this.lastRefresh && new Date().getTime() < this.lastRefresh+ 5 * 60000) {
      console.log("return local channel groups")
      return of(this.localChannelGroups);
    }
    return this.squacApi.get(this.url).pipe(
      map(
        results => {
          const channelGroups: ChannelGroup[] = [];

          results.forEach(cG => {
            channelGroups.push(this.mapChannelGroups(cG));
          });
          return channelGroups;
        }
      ),
      tap(
        channelGroups => {
          this.localChannelGroups = channelGroups;
          this.lastRefresh = new Date().getTime();
        }
      )
    );
  }

  updateLocalChannelGroup(id, channelGroup?) {
    const index = this.localChannelGroups.findIndex(d => d.id === id);

    if (index > -1) {
      if (channelGroup) {
        this.localChannelGroups[index] = channelGroup;

      } else {
        this.localChannelGroups.splice(index, 1);
      }
    } else {
      this.localChannelGroups.push(channelGroup);
    }
  }

  // Gets a specific channel group from server
  getChannelGroup(id: number): Observable<ChannelGroup> {

    //check if channel group exists, hasn't been fetched recently, hasn't been updated by user.
      return this.squacApi.get(this.url, id).pipe(
        map(
          response => {
            return this.mapChannelGroups(response);
          }
        ),
        tap( channelGroup =>{
          this.localChannelGroups[channelGroup.id] = channelGroup;
        })
      );
    
  }

  // Replaces channel group with new channel group
  updateChannelGroup(channelGroup: ChannelGroup): Observable<ChannelGroup> {
    //reset update time
    const postData: ChannelGroupsHttpData = {
      name: channelGroup.name,
      description: channelGroup.description,
      share_org: channelGroup.shareOrg,
      share_all: channelGroup.shareAll,
      channels : channelGroup.channelIds
    };
    if (channelGroup.id) {
      postData.id = channelGroup.id;
      // this.localChannelGroups[channelGroup.id] = channelGroup;
      return this.squacApi.put(this.url, channelGroup.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }
  private mapChannelGroups(squacData) : ChannelGroup {
    const channels = [];
    const channelIds = []
    let channelGroup: ChannelGroup;
    if (squacData.channels) {
      squacData.channels.forEach(c => {
        if(c.id) {
          const channel = new Channel(
            c.id,
            c.code,
            c.name,
            c.sample_rate,
            c.lat,
            c.lon,
            c.elev,
            c.loc,
            c.station_code,
            c.network
          );
        
          channels.push(channel);
          channelIds.push(channel.id);
        } else {
          channelIds.push(c);
        }
      });
    }
    
    channelGroup = new ChannelGroup(
      squacData.id,
      squacData.user_id,
      squacData.name,
      squacData.description,
      squacData.organization,
      squacData.share_org,
      squacData.share_all,
      channelIds
    );

    if(channels.length > 0) {
      channelGroup.channels = channels;
    }

    return channelGroup;
  }

  // Deletes a channel group
  deleteChannelGroup(id: number) {
    //remove group from local
    this.updateLocalChannelGroup(id);
    return this.squacApi.delete(this.url, id);
  }
}
