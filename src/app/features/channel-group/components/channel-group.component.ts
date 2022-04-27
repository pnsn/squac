import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NetworkService } from "@features/channel-group/services/network.service";

@Component({
  selector: "channel-group-main",
  template: "<router-outlet></router-outlet>",
})
export class ChannelGroupComponent implements OnInit, OnDestroy {
  // channelGroups: ChannelGroup[];
  subscription: Subscription = new Subscription();

  constructor(private networkService: NetworkService) {}

  ngOnInit() {
    const networkService = this.networkService.fetchNetworks();
    this.subscription.add(networkService);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
