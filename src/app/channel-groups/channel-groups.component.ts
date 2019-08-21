import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChannelGroup } from '../shared/channel-group';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelsService } from '../shared/channels.service';
import { NetworksService } from './networks.service';
import { ChannelGroupsService } from './channel-groups.service';

@Component({
  selector: 'app-channel-groups',
  templateUrl: './channel-groups.component.html',
  styleUrls: ['./channel-groups.component.scss']
})
export class ChannelGroupsComponent implements OnInit, OnDestroy {
  // channelGroups: ChannelGroup[];
  subscription: Subscription = new Subscription();

  constructor(  
    private router: Router,
    private route: ActivatedRoute,
    private channelGroupsService : ChannelGroupsService,
    private networksService : NetworksService
  ) {}

  ngOnInit() {
    //Gets channels but doesn't use
    const sub1 = this.networksService.fetchNetworks();
    const sub2 = this.channelGroupsService.fetchChannelGroups();

    // const sub = this.ChannelGroupsService.channelGroupsChanged.subscribe(
    //   (channelGroups: ChannelGroup[]) => {
    //     this.channelGroups = channelGroups;
    //   }
    // )
    
    this.subscription.add(sub1);
    this.subscription.add(sub2);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addChannelGroup() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}