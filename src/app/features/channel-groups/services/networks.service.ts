import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SquacApiService } from '@core/services/squacapi.service';
import { Network, NetworkAdapter } from '../models/network';

@Injectable({
  providedIn: 'root'
})

// Service for handling networks
export class NetworksService {

  private url = 'nslc/networks/';
  // Subscribeable networks
  constructor(
    private squacApi: SquacApiService,
    private networkAdapter: NetworkAdapter
  ) {
  }

  // Get all networks from api
  fetchNetworks() {
    this.squacApi.get(this.url).pipe(
      map( response => response.map(r => this.networkAdapter.adaptFromApi(r)))
    )
    .subscribe(
      networks => {
      },
      error => {
        console.log('error in networks service: ' + error);
      }
    );
  }
}
