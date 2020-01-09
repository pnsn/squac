import { Component, OnInit } from '@angular/core';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { ChannelGroupsService } from 'src/app/channel-groups/channel-groups.service';
import { WidgetEditService } from '../widget-edit.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-channel-groups-edit',
  templateUrl: './channel-groups-edit.component.html',
  styleUrls: ['./channel-groups-edit.component.scss']
})
export class ChannelGroupsEditComponent implements OnInit {
  availableChannelGroups: ChannelGroup[];
  selectedChannelGroup: ChannelGroup;
  subscriptions: Subscription = new Subscription();
  constructor(
    private channelGroupsService: ChannelGroupsService,
    private widgetEditService: WidgetEditService,
  ) { }

  ngOnInit() {
    this.channelGroupsService.fetchChannelGroups();
    const sub2 = this.channelGroupsService.getChannelGroups.subscribe(channelGroups => {
      this.availableChannelGroups = channelGroups;
    });

    this.selectedChannelGroup = this.widgetEditService.getChannelGroup();

    this.subscriptions.add(sub2);
  }

  getChannelsForChannelGroup(group) {
    this.selectedChannelGroup = group;

    if (this.selectedChannelGroup.id) {
      this.widgetEditService.updateChannelGroup(this.selectedChannelGroup);
      const channelGroupsSub = this.channelGroupsService.getChannelGroup(this.selectedChannelGroup.id).subscribe(
        channelGroup => {
          this.selectedChannelGroup = channelGroup;
        }
      );

      this.subscriptions.add(channelGroupsSub);
    }

  }

}
