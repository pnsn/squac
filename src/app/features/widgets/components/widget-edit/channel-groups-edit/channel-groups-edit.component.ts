import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ChannelGroup } from '@core/models/channel-group';
import { ChannelGroupsService } from '@features/channel-groups/services/channel-groups.service';
import { WidgetEditService } from '../../../services/widget-edit.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-channel-groups-edit',
  templateUrl: './channel-groups-edit.component.html',
  styleUrls: ['./channel-groups-edit.component.scss']
})
export class ChannelGroupsEditComponent implements OnInit, OnDestroy {
  @Input('channelGroups') channelGroups : ChannelGroup[];
  availableChannelGroups: ChannelGroup[];
  selectedChannelGroup: ChannelGroup;
  subscriptions: Subscription = new Subscription();

  loading = true;

  constructor(
    private channelGroupsService: ChannelGroupsService,
    private widgetEditService: WidgetEditService,
  ) { }

  ngOnInit() {
    this.availableChannelGroups = this.channelGroups;

    this.selectedChannelGroup = this.widgetEditService.getChannelGroup();
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
