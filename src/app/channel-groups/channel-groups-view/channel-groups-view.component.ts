import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChannelGroup } from '../../shared/channel-group';
import { Channel } from '../../shared/channel';
import { Subscription } from 'rxjs';
import { ChannelGroupsService } from '../channel-groups.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-channel-groups-view',
  templateUrl: './channel-groups-view.component.html',
  styleUrls: ['./channel-groups-view.component.scss']
})
export class ChannelGroupsViewComponent implements OnInit, OnDestroy {
  channelGroups: ChannelGroup[];
  selectedChannelGroup: ChannelGroup;
  selectedChannels: Channel[] = [];
  subscription: Subscription;

  //Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private channelGroupsService: ChannelGroupsService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subscription = this.channelGroupsService.getChannelGroups.subscribe(channelGroups => {
      this.channelGroups = channelGroups;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addChannelGroup() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onSelect($event) {
    this.channelGroupsService.getChannelGroup($event.selected[0].id).subscribe(channelGroup => {
      this.selectedChannelGroup = channelGroup;
      this.selectedChannels = this.selectedChannelGroup.channels;
    });
  }
}
