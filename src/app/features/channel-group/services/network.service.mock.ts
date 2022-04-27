import { BehaviorSubject } from "rxjs";
import { Network } from "../models/network";

export class MockNetworkService {
  networks = new BehaviorSubject<Network[]>([]);

  testNetwork = new Network("code", "name", "description");

  fetchNetworks() {
    this.networks.next([this.testNetwork]);
  }
}
