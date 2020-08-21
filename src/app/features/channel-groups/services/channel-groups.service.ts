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
  channels: string[];
  share_org: boolean;
  share_all: boolean;
  id?: number;
}

// should I use index or id
@Injectable({
  providedIn: 'root'
})
export class ChannelGroupsService {
  localChannelGroups: {} = {}; // Will want to store temporarily (redo on save?)

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
    return this.squacApi.get(this.url).pipe(
      map(
        results => {
          const channelGroups: ChannelGroup[] = [];

          results.forEach(cG => {
            const chanGroup = new ChannelGroup(
              cG.id,
              cG.user_id,
              cG.name,
              cG.description,
              cG.share_org,
              cG.share_all
            );
            this.localChannelGroups[cG.id] = chanGroup;
            channelGroups.push(chanGroup);
          });
          return channelGroups;
        }
      ),
      tap(
        channelGroups => {
          // this.updateChannelGroups(channelGroups);
        }
      )
    );
  }

  // Gets a specific channel group from server
  getChannelGroup(id: number): Observable<ChannelGroup> {
    if (this.localChannelGroups[id] && this.localChannelGroups[id].channels) {
      return of(this.localChannelGroups[id]);
    } else {
      return this.squacApi.get(this.url, id).pipe(
        map(
          response => {
            const channels = [];
            let channelGroup: ChannelGroup;
            if (response.channels) {
              response.channels.forEach(c => {
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
              });
            }


            channelGroup = new ChannelGroup(
              response.id,
              response.user_id,
              response.name,
              response.description,
              response.share_org,
              response.share_all,
              channels
            );

            this.localChannelGroups[channelGroup.id] = channelGroup;
            return channelGroup;
          }
        )
      );
    }
  }

  // Replaces channel group with new channel group
  updateChannelGroup(channelGroup: ChannelGroup): Observable<ChannelGroup> {
    const postData: ChannelGroupsHttpData = {
      name: channelGroup.name,
      description: channelGroup.description,
      share_org: channelGroup.shareOrg,
      share_all: channelGroup.shareAll,
      channels : channelGroup.channelsIdsArray
    };
    if (channelGroup.id) {
      postData.id = channelGroup.id;
      this.localChannelGroups[channelGroup.id] = channelGroup;
      return this.squacApi.put(this.url, channelGroup.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }

  // Deletes a channel group
  deleteChannelGroup(id: number) {
    return this.squacApi.delete(this.url, id);
  }
}
