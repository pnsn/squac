import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Network } from './network';
@Injectable({
  providedIn: 'root'
})
export class NetworksService {

  private networks: Network[] = [];

  constructor(
    private http : HttpClient
  ) {
  }


  getNetworks() {
    return this.networks.slice();
  }

  fetchNetworks(){
    this.http.get<any>(
      'https://squac.pnsn.org/v1.0/nslc/networks/'
    ).pipe(
      map(
        networks => {
          let nets : Network[] = [];
          networks.forEach(network => {
            let net = new Network(
              network.id,
              network.code,
              network.name,
              network.description
            )
            nets.push(net);
          });
          return nets;
        }
      )
    )
    .subscribe(networks => {
      this.networks = networks;
      console.log(this.networks);
    });
  }
}
