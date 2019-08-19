import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, tap, filter, catchError } from 'rxjs/operators';
import { Channel } from './channel';
import { Subject, BehaviorSubject, throwError } from 'rxjs';


export interface SquacResponseData {

}

@Injectable({
  providedIn: 'root'
})

export class ChannelsService {
  constructor(
    private http : HttpClient
  ) { }
  channels = new BehaviorSubject<Channel[]>([]);

  setChannels(channels : Channel[]) {
    this.channels.next(channels);
  }

  fetchNslcs() {
    return this.http
      .get<any>(
        'https://squac.pnsn.org/v1.0/nslc/networks/'
      ).pipe(
        catchError(this.handleError),
        //this needs to be improved in the future
        map(networks => this.processNslcs(networks)),
        tap( channels => {
          this.setChannels(channels);
        })
    );
  }

  //TODO: this will change with the schema changes on jon's end
  private processNslcs(networks : any) : Channel[]{
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
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred: ${error.error.message}');
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        'Backend returned code ${error.status}, ' +
        'body was: ${error.error}');
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.'
    );
  };
}
