import { Subject, BehaviorSubject, Observable, of, throwError } from "rxjs";
import { Network } from "../models/network";

export class MockNetworksService {
  networks = new BehaviorSubject<Network[]>([]);

  testNetwork = new Network("code", "name", "description");

  fetchNetworks() {
    this.networks.next([this.testNetwork]);
  }
}
