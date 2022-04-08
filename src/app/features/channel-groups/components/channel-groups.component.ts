import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworksService } from '../services/networks.service';

@Component({
  selector: 'app-channel-groups',
  templateUrl: './channel-groups.component.html',
  styleUrls: ['./channel-groups.component.scss']
})
export class ChannelGroupsComponent implements OnInit, OnDestroy {
  // channelGroups: ChannelGroup[];
  subscription: Subscription = new Subscription();

  constructor(
    private networksService: NetworksService
  ) {}

  ngOnInit() {
    const networksService = this.networksService.fetchNetworks();
    this.subscription.add(networksService);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
