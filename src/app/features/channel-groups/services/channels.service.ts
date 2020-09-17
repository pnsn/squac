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
          channels.push(this.mapChannel(c));
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
          response => {
            return this.mapChannel(response);
          }
        ),
        tap (
          channel => {
            // this.localChannels[channel.id] = channel;
          }
        )
      );
    }
  }

  private mapChannel(squacData) : Channel {
    const channel = new Channel(
      squacData.id,
      squacData.code,
      squacData.name,
      squacData.sample_rate,
      squacData.lat,
      squacData.lon,
      squacData.elev,
      squacData.loc,
      squacData.station_code,
      squacData.network
    );
    return channel;
  }
}
