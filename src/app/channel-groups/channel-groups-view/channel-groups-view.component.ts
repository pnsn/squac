import { Component, OnInit } from '@angular/core';
import { ChannelGroup } from '../../shared/channel-group';
import { Subscription } from 'rxjs';
import { ChannelGroupsService } from '../../shared/channel-groups.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-channel-groups-view',
  templateUrl: './channel-groups-view.component.html',
  styleUrls: ['./channel-groups-view.component.scss']
})
export class ChannelGroupsViewComponent implements OnInit {
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
