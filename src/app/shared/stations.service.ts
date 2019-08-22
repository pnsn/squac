import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map, tap, filter, catchError } from 'rxjs/operators';
import { Channel } from './channel';
import { Subject, BehaviorSubject, throwError, Observable } from 'rxjs';
import { Network } from '../channel-groups/network';
import { SquacApiService } from '../squacapi';
import { Station } from '../channel-groups/station';

@Injectable({
  providedIn: 'root'
})

export class StationsService extends SquacApiService {
  constructor(
    http : HttpClient
 ) {
   super("nslc/stations/", http);
 }
  channels = new BehaviorSubject<Channel[]>([]);
  private filteredNetwork : Network;

  private setChannels(channels : Channel[]) {
    this.channels.next(channels);
  }

  fetchStations(network: Network) {
    this.filteredNetwork = network;
    console.log("network: " + network.code);
    super.get(null, 
      {
        "network" : network.code
      }
    ).pipe(
        //this needs to be improved in the future
        map(stations => {
          let channels : Channel[] = [];
          let filteredNetwork = this.filteredNetwork;
          console.log(filteredNetwork);
          stations.forEach(station => {
            //do stuff with stations
          });
          return channels;
        })
    ).subscribe(channels => {
      console.log("fetched stations")
    });
  }

  fetchChannels(network : Network) {
    this.filteredNetwork = network;
    console.log("network: " + network.code);
    super.get(null, 
      {
        "network" : network.code
      }
    ).pipe(
        //this needs to be improved in the future
        map(stations => {
          let channels : Channel[] = [];
          let filteredNetwork = this.filteredNetwork;
          console.log(filteredNetwork);
          stations.forEach(station => {
              station.channels.forEach(channel => {
                let channelObject = new Channel(
                  channel.id,
                  channel.code,
                  channel.name,
                  channel.sample_rate,
                  channel.lat,
                  channel.lon,
                  channel.elev,
                  channel.loc
                );
                channelObject.setStation(
                  station.id,
                  station.code,
                  station.name
                );
                channelObject.setNetwork(
                  filteredNetwork.id,
                  filteredNetwork.code,
                  filteredNetwork.name
                );
                channels.push(channelObject);
              });
          });
          return channels;
        })
    ).subscribe(channels => {
      console.log("done!")
      console.log(channels);
      this.setChannels(channels);
    });
  }

    //TODO: figure out stations service 
    getStation(id: number) : Observable<Station>{
      //temp 
      return super.get(id).pipe(
        map(
          station => {
            let stationObject = new Station(
              station.id,
              station.name,
              station.code,
              station.description
            );
            // stationObject.networkID = st.station; 
            return stationObject;
          }
        )
      );
    }
}
