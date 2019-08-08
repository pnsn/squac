import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChannelGroup } from '../shared/channel-group';
import { ChannelGroupsService } from '../shared/channel-groups.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-channel-groups',
  templateUrl: './channel-groups.component.html',
  styleUrls: ['./channel-groups.component.scss']
})
export class ChannelGroupsComponent implements OnInit, OnDestroy {
  channelGroups: ChannelGroup[];
  subscription: Subscription;
  constructor(  
    private ChannelGroupsService: ChannelGroupsService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.channelGroups = this.ChannelGroupsService.getChannelGroups();
    this.subscription = this.ChannelGroupsService.channelGroupsChanged.subscribe(
      (channelGroups: ChannelGroup[]) => {
        this.channelGroups = channelGroups;
      }
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addChannelGroup() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}