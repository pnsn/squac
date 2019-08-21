import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChannelGroup } from '../shared/channel-group';
import { ChannelGroupsService } from '../shared/channel-groups.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelsService } from '../shared/channels.service';

@Component({
  selector: 'app-channel-groups',
  templateUrl: './channel-groups.component.html',
  styleUrls: ['./channel-groups.component.scss']
})
export class ChannelGroupsComponent implements OnInit, OnDestroy {
  // channelGroups: ChannelGroup[];
  subscription: Subscription = new Subscription();

  constructor(  
    private ChannelGroupsService: ChannelGroupsService,
    private router: Router,
    private route: ActivatedRoute,
    private channelsService: ChannelsService
  ) {}

  ngOnInit() {
    //Gets channels but doesn't use
    const sub1 = this.channelsService.fetchNslcs().subscribe(result => {
      console.log(result);
    });
    // this.channelGroups = this.ChannelGroupsService.getChannelGroups();

    // const sub = this.ChannelGroupsService.channelGroupsChanged.subscribe(
    //   (channelGroups: ChannelGroup[]) => {
    //     this.channelGroups = channelGroups;
    //   }
    // )
    
    this.subscription.add(sub1);
    // this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addChannelGroup() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}