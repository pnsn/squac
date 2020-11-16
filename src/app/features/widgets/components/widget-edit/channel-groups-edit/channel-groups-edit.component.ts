import { Component, OnInit, OnDestroy, Input, AfterViewInit, ViewChild } from '@angular/core';
import { ChannelGroup } from '@core/models/channel-group';
import { ChannelGroupsService } from '@features/channel-groups/services/channel-groups.service';
import { WidgetEditService } from '../../../services/widget-edit.service';
import { Subscription } from 'rxjs';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-channel-groups-edit',
  templateUrl: './channel-groups-edit.component.html',
  styleUrls: ['./channel-groups-edit.component.scss']
})
export class ChannelGroupsEditComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() channelGroups: ChannelGroup[];
  @ViewChild('channelTable') channelTable;
  availableChannelGroups: ChannelGroup[];
  selectedChannelGroup: ChannelGroup[] = [];
  subscriptions: Subscription = new Subscription();
  selectedChannelGroupId;
  loading = true;
  ColumnMode = ColumnMode;
  SelectionType =  SelectionType;
  constructor(
    private channelGroupsService: ChannelGroupsService,
    private widgetEditService: WidgetEditService,
  ) { }

  ngOnInit() {
    this.availableChannelGroups = this.channelGroups;
    this.selectedChannelGroup[0] = this.widgetEditService.getChannelGroup();
    if (this.selectedChannelGroup ) {
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(){
    if (this.availableChannelGroups) {
      this.availableChannelGroups = [...this.availableChannelGroups]; // This is input into <ngx-datatable>
      this.channelTable.recalculate(); // ngx-datatable reference
    }
  }
    // onSelect function for data table selection
    onSelect($event) { // When a row is selected, route the page and select that channel group
      const selectedId = $event.selected[0].id;
      if (selectedId) {
        this.selectedChannelGroupId = selectedId;
        this.selectChannelGroup(selectedId);
      }
    }

      // Getting a selected channel group and setting variables
  selectChannelGroup(selectedChannelGroupId: number) {
    this.selectedChannelGroup = this.channelGroups.filter( cg => { // Select row with channel group
      return (cg.id === selectedChannelGroupId);
    });
  }

  viewChannels(id) {
    console.log(id);
  }

  getChannelsForChannelGroup(group) {
    this.loading = true;
    this.selectedChannelGroup = group;

    if (this.selectedChannelGroup[0].id) {
      this.widgetEditService.updateChannelGroup(this.selectedChannelGroup);
      const channelGroupsSub = this.channelGroupsService.getChannelGroup(this.selectedChannelGroup[0].id).subscribe(
        channelGroup => {
          this.selectedChannelGroup[0] = channelGroup;
          this.loading = false;
        }, error => {
          console.log('error in channel grouups edit update: ' + error);
        }
      );

      this.subscriptions.add(channelGroupsSub);
    }

  }

}
