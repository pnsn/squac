
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';

import { Network } from './network';


export class MockNetworksService {

  networks = new BehaviorSubject<Network[]>([]);

  testNetwork = new Network(
    1,
    "",
    "",
    ""
  );

  fetchNetworks() {
    this.networks.next([this.testNetwork]);
  }

  getNetworks(id: number) : Observable<Network>{
    return of(this.testNetwork);
  }
}