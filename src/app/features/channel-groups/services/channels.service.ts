import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map, tap, filter, catchError } from 'rxjs/operators';
import { Channel, ChannelAdapter } from '@core/models/channel';
import { Subject, BehaviorSubject, throwError, Observable, of } from 'rxjs';
import { Network } from '../models/network';
import { SquacApiService } from '@core/services/squacapi.service';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ChannelsService {
  private url = 'nslc/channels/';
  constructor(
    private squacApi: SquacApiService,
    private channelAdapter: ChannelAdapter
  ) {
  }
  channels = new BehaviorSubject<Channel[]>([]);

  getChannelsByFilters(filters: Params): Observable<Channel[]> {
   return this.squacApi.get(this.url, null, filters).pipe(
     map( response => response.map(r => this.channelAdapter.adaptFromApi(r)))
    );
  }
}
