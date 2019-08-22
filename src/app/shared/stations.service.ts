import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map, tap, filter, catchError } from 'rxjs/operators';
import { Channel } from './channel';
import { Subject, BehaviorSubject, throwError, Observable, of } from 'rxjs';
import { Network } from '../channel-groups/network';
import { SquacApiService } from '../squacapi';
import { Station } from '../channel-groups/station';
import { NetworksService } from '../channel-groups/networks.service';

@Injectable({
  providedIn: 'root'
})

export class StationsService extends SquacApiService {
  private localStations : {} = {};
  constructor(
    http : HttpClient,
    private networksService : NetworksService
 ) {
   super("nslc/stations/", http);
 }

  private filteredNetwork : Network;

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
          let stas : Station[] = [];
          let filteredNetwork = this.filteredNetwork;
          console.log(filteredNetwork);
          stations.forEach(station => {
            let staObj = new Station (
              station.id,
              station.code,
              station.name,
              station.description
            )
            this.localStations[station.id] = staObj;
            station.push(staObj);
            //do stuff with stations
          });
          return stas;
        })
    ).subscribe(stations => {
      console.log("fetched stations")
    });
  }

  fetchChannels(network : Network) : Observable<Channel[]>{
    return super.get(null, 
      {
        "network" : network.code
      }
    ).pipe(map(
      stations => {
        let channels = [];
        stations.forEach(station => {
          this.localStations[station.id] = new Station(
            station.id,
            station.code,
            station.name,
            station.description,
            network
          );

          station.channels.forEach(channel => {
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
            channelObject.station = this.localStations[station.id];
            channels.push(channelObject);
          });
        });
        return channels;
      }
    ));
  }

  //TODO: figure out stations service 
  getStation(id: number) : Observable<Station>{
    if(this.localStations[id]) {
      return of(this.localStations[id]);
    } else {
      return super.get(id).pipe(
        map(
          station => {
            let stationObject = new Station(
              station.id,
              station.name,
              station.code,
              station.description
            );
            this.networksService.getNetwork(station.network).subscribe(network => {
              stationObject.network = network;
            }); 
            return stationObject;
          }
        )
      );
    }
  }
}
