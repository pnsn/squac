import { Injectable } from '@angular/core';
import { ChannelGroup, ChannelGroupAdapter } from '@core/models/channel-group';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { Channel } from '@core/models/channel';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SquacApiService } from '@core/services/squacapi.service';

interface ChannelGroupsHttpData {
  name: string;
  description: string;
  channels: number[];
  share_org: boolean;
  share_all: boolean;
  id?: number;
  organization: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChannelGroupsService {
  // Squac url for groups
  private url = 'nslc/groups/';
  // Store groups
  private localChannelGroups: ChannelGroup[] = [];
  // Time stamp of last refresh
  private lastRefresh: number;

  constructor(
    private squacApi: SquacApiService,
    private channelGroupAdapter: ChannelGroupAdapter
  ) {
  }

  // Gets channel groups from server
  getChannelGroups(): Observable<ChannelGroup[]> {
    if (this.lastRefresh && new Date().getTime() < this.lastRefresh + 5 * 60000) {
      return of(this.localChannelGroups);
    }
    return this.squacApi.get(this.url).pipe(
      map( results => results.map(r => this.channelGroupAdapter.adaptFromApi(r))),
      tap(
        channelGroups => {
          this.lastRefresh = new Date().getTime();
        }
      )
    );
  }

  // Save channel groups to server
  updateLocalChannelGroup(id, channelGroup?): void {
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

  // Gets a specific channel group with id from server
  getChannelGroup(id: number): Observable<ChannelGroup> {
    return this.squacApi.get(this.url, id).pipe(
      map( response => this.channelGroupAdapter.adaptFromApi(response)),
      tap( group => this.updateLocalChannelGroup(group.id, group))
    );
  }

  // Replaces channel group with new channel group
  updateChannelGroup(channelGroup: ChannelGroup) {
    const postData = this.channelGroupAdapter.adaptToApi(channelGroup);
    if (channelGroup.id) {
      return this.squacApi.put(this.url, channelGroup.id, postData).pipe(
        map( response => this.channelGroupAdapter.adaptFromApi(response)),
        tap(group =>this.updateLocalChannelGroup(group.id, group))
      );
    }
    return this.squacApi.post(this.url, postData).pipe(
      map( response => this.channelGroupAdapter.adaptFromApi(response)),
      tap(group =>this.updateLocalChannelGroup(group.id, group))
    );
  }


  // Deletes a channel group
  deleteChannelGroup(id: number): Observable<any> {
    // remove group from local
    this.updateLocalChannelGroup(id);
    return this.squacApi.delete(this.url, id);
  }

  // Map squacapi channel group to channel group
  private mapChannelGroup(squacData): ChannelGroup {
    const channels = [];
    const channelIds = [];
    let channelGroup: ChannelGroup;
    if (squacData.channels) {
      squacData.channels.forEach(c => {
        if (c.id) {
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

    if (channels.length > 0) {
      channelGroup.channels = channels;
    }

    return channelGroup;
  }

}
