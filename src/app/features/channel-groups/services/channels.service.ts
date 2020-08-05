import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map, tap, filter, catchError } from 'rxjs/operators';
import { Channel } from '@core/models/channel';
import { Subject, BehaviorSubject, throwError, Observable, of } from 'rxjs';
import { Network } from '../models/network';
import { SquacApiService } from '@core/services/squacapi.service';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ChannelsService {
  private localChannels: {} = {};
  private filteredNetwork: Network;
  private url = 'nslc/channels/';
  constructor(
    private squacApi: SquacApiService
  ) {
  }
  channels = new BehaviorSubject<Channel[]>([]);

  private setChannels(channels: Channel[]) {
    this.channels.next(channels);
  }

  getChannelsByFilters(filters: Params): Observable<Channel[]> {
   return this.squacApi.get(this.url, null, filters).pipe(
     map(
      response => {
        const channels = [];
        response.forEach(c => {
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
        return channels;
      })
    );
  }

  getChannel(id: number): Observable<Channel> {
    if (this.localChannels[id]) {
      return of(this.localChannels[id]);
    } else {
      return this.squacApi.get(this.url, id).pipe(
        map(
          channel => {
            const channelObject = new Channel(
              channel.id,
              channel.code,
              channel.name,
              channel.sample_rate,
              channel.lat,
              channel.lon,
              channel.elev,
              channel.loc,
              channel.station_code,
              channel.network
            );
            this.localChannels[channel.id] = channelObject;
            return channelObject;
          }
        )
      );
    }
  }
}
