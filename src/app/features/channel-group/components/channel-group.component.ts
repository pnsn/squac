import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NetworkService } from "@channelGroup/services/network.service";

@Component({
  selector: "channel-group-main",
  template:
    "<div class='body-content-container'><router-outlet></router-outlet></div>",
})
export class ChannelGroupComponent implements OnInit, OnDestroy {
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
