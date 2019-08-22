import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Network } from './network';
import { SquacApiService } from '../squacapi';
@Injectable({
  providedIn: 'root'
})
export class NetworksService extends SquacApiService{
  private localNetworks : {} = {};
  networks = new BehaviorSubject<Network[]>([]);

  constructor(
    http : HttpClient
 ) {
   super("nslc/networks/", http);
 }

  setNetworks(networks : Network[]) {
    this.networks.next(networks);
  }
  // getNetworks() {
  //   return this.networks.slice();
  // }

  fetchNetworks(){
    super.get().pipe(
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
            this.localNetworks[network.id] = net;

            nets.push(net);
          });
          return nets;
        }
      )
    )
    .subscribe(networks => {
      this.setNetworks(networks);
    });
  }

    //TODO: figure out stations service 
    getNetwork(id: number) :Observable<Network>{
      if(this.localNetworks[id]) {
        return of(this.localNetworks[id]);
      } else {
        return super.get(id).pipe(
          map(
            network => {
              let networkObject = new Network(
                network.id,
                network.code,
                network.name,
                network.description
              );
              return networkObject;
            }
          )
        );
      }
    }
}
