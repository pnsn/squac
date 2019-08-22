import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map, tap, filter, catchError } from 'rxjs/operators';
import { Channel } from './channel';
import { Subject, BehaviorSubject, throwError, Observable, of } from 'rxjs';
import { Network } from '../channel-groups/network';
import { SquacApiService } from '../squacapi';
import { StationsService } from './stations.service';

@Injectable({
  providedIn: 'root'
})

export class ChannelsService extends SquacApiService {
  private localChannels : {} = {};
  constructor(
    http : HttpClient,
    private stationsService : StationsService
 ) {
   super("nslc/channels/", http);
 }
  channels = new BehaviorSubject<Channel[]>([]);

  private setChannels(channels : Channel[]) {
    this.channels.next(channels);
  }

  fetchChannels(network : Network) {
    this.stationsService.fetchChannels(network)
      .subscribe(channels => {
        this.setChannels(channels);
      });
  }

  //TODO: figure out stations service 
  getChannel(id: number) : Observable<Channel>{
    if(this.localChannels[id]) {
      return of(this.localChannels[id]);
    } else {
      return super.get(id).pipe(
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
              channel.loc
            );
            this.stationsService.getStation(channel.station).subscribe(station=>{
              channelObject.station = station;
            }); 
            return channelObject;
          }
        )
      );
    }
  }

}
