import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map, tap, filter, catchError } from 'rxjs/operators';
import { Channel } from './channel';
import { Subject, BehaviorSubject, throwError, Observable, of } from 'rxjs';
import { Network } from '../channel-groups/network';
import { SquacApiService } from '../squacapi';

@Injectable({
  providedIn: 'root'
})

export class ChannelsService {
  private localChannels : {} = {}; 
  private filteredNetwork : Network;

  constructor(
    private squacApi : SquacApiService
  ) {
    squacApi.url = "nslc/channels/";
  }
  channels = new BehaviorSubject<Channel[]>([]);

  private setChannels(channels : Channel[]) {
    this.channels.next(channels);
  }

  fetchChannels(network : Network) {
   this.squacApi.get(null, 
      {
        "network" : network.code
      }
    ).pipe(map(
      channels => {
        let _channels = [];
        channels.forEach(channel => {
          let channelObject = new Channel(
            channel.id,
            channel.name,
            channel.code,
            channel.sample_rate,
            channel.lat,
            channel.lon,
            channel.elev,
            channel.loc,
            channel.station_code,
            channel.network
          );
          _channels.push(channelObject);
        });
        return _channels;
      }
    ))
    .subscribe(channels => {
      this.setChannels(channels);
    });
  }

  getChannel(id: number) : Observable<Channel>{
    if(this.localChannels[id]) {
      return of(this.localChannels[id]);
    } else {
      return this.squacApi.get(id).pipe(
        map(
          channel => {
            let channelObject = new Channel(
              channel.id,
              channel.name,
              channel.code,
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
