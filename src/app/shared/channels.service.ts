import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map, tap, filter, catchError } from 'rxjs/operators';
import { Channel } from './channel';
import { Subject, BehaviorSubject, throwError } from 'rxjs';
import { Network } from '../channel-groups/network';


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
  private filteredNetwork : Network;
  
  private setChannels(channels : Channel[]) {
    this.channels.next(channels);
  }

  fetchChannels(network : Network) {
    this.filteredNetwork = network;
    this.http
      .get<any>(
        'https://squac.pnsn.org/v1.0/nslc/stations/',
        {
          params : {
            "net" : network.code
          }
        }
      ).pipe(
        catchError(this.handleError),
        //this needs to be improved in the future
        map(stations => {
          let channels : Channel[] = [];

          stations.forEach(station => {
            const sta = station.code;
            const staName = station.name;
      
              station.channels.forEach(channel => {
                let channelObject = new Channel(
                  channel.name,
                  channel.code,
                  channel.sample_rate,
                  channel.lat,
                  channel.lon,
                  channel.elev,
                  channel.loc,
                  staName,
                  sta,
                  this.filteredNetwork.code,
                  this.filteredNetwork.name
                );
                channels.push(channelObject);
              });
          });
          return channels;
        })
    ).subscribe(channels => {
      console.log("done!")
      this.setChannels(channels);
    });
  }

  //TODO: this will change with the schema changes on jon's end
  // private processNslcs(stations : any) : Channel[]{

  // }

  private handleError(error: HttpErrorResponse) {
    console.error(error)
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
