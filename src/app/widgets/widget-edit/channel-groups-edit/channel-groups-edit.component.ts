import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { ChannelGroupsService } from 'src/app/channel-groups/channel-groups.service';
import { WidgetEditService } from '../widget-edit.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-channel-groups-edit',
  templateUrl: './channel-groups-edit.component.html',
  styleUrls: ['./channel-groups-edit.component.scss']
})
export class ChannelGroupsEditComponent implements OnInit, OnDestroy {
  availableChannelGroups: ChannelGroup[];
  selectedChannelGroup: ChannelGroup;
  subscriptions: Subscription = new Subscription();

  loading = true;

  constructor(
    private channelGroupsService: ChannelGroupsService,
    private widgetEditService: WidgetEditService,
  ) { }

  ngOnInit() {
    this.channelGroupsService.fetchChannelGroups();
    const sub2 = this.channelGroupsService.getChannelGroups.subscribe(
      channelGroups => {
        this.availableChannelGroups = channelGroups;
        this.loading = false;
      }, error => {
        console.log('error in channelGroups edit: ' + error);
      }
    );

    this.selectedChannelGroup = this.widgetEditService.getChannelGroup();

    this.subscriptions.add(sub2);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getChannelsForChannelGroup(group) {
    this.loading = true;
    this.selectedChannelGroup = group;

    if (this.selectedChannelGroup.id) {
      this.widgetEditService.updateChannelGroup(this.selectedChannelGroup);
      const channelGroupsSub = this.channelGroupsService.getChannelGroup(this.selectedChannelGroup.id).subscribe(
        channelGroup => {
          this.selectedChannelGroup = channelGroup;
          this.loading = false;
        }, error => {
          console.log('error in channel grouups edit update: ' + error);
        }
      );

      this.subscriptions.add(channelGroupsSub);
    }

  }

}
