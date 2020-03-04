
import { Subject, BehaviorSubject, Observable, of, throwError } from 'rxjs';

import { Network } from './network';


export class MockNetworksService {

  networks = new BehaviorSubject<Network[]>([]);

  testNetwork = new Network(
    1,
    "code",
    "name",
    "description"
  );

  fetchNetworks() {
    this.networks.next([this.testNetwork]);
  }

  getNetwork(id: number) : Observable<Network>{
    if( id === this.testNetwork.id) {
      return of(this.testNetwork);
    } else {
      return throwError('not found');
    }
  }


}