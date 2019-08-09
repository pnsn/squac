import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, filter } from 'rxjs/operators';
import { Channel } from './channel';
import { Subject } from 'rxjs';


export interface SquacResponseData {

}

@Injectable({
  providedIn: 'root'
})

export class ChannelsService {
  constructor(
    private http : HttpClient
  ) { }
  channels = new Subject<Channel[]>();

  setChannels(channels : Channel[]) {
    this.channels.next(channels);
    console.log(channels)
  }

  fetchNslcs() {
    console.log("fetch!")
    return this.http
      .get<any>(
        'https://squac.pnsn.org/v1.0/nslc/networks/'
      ).pipe(
        //this needs to be improved in the future
        map(networks => {
          console.log(networks)
          let channels : Channel[] = [];

          networks.forEach(network => {
            const net = network.code;
            const netName = network.name;

            network.stations.forEach(station => {
              const sta = station.code;
              const staName = station.name;

              station.locations.forEach(location => {
                const lat = location.lat;
                const lon = location.lon;
                const elev = location.elev;
                const loc = location.code;

                location.channels.forEach(channel => {
                  let channelObject = new Channel(
                    channel.name,
                    channel.code,
                    channel.sample_rate,
                    lat,
                    lon,
                    elev,
                    loc,
                    staName,
                    sta,
                    net,
                    netName
                  );
                  channels.push(channelObject);
                })
              });
            });
          });
          return channels;
        }),
        tap( channels => {
          this.setChannels(channels);
        })
    );
  }
}
