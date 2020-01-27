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
  selected: ChannelGroup[];
  selectedChannelGroup: ChannelGroup;
  selectedChannels: Channel[];
  subscription: Subscription = new Subscription();
  isSelected: boolean;

  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private channelGroupsService: ChannelGroupsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.selected = [];
    this.selectedChannels = [];
    this.subscription = this.channelGroupsService.getChannelGroups.subscribe(channelGroups => {
      this.channelGroups = channelGroups;
      const selectedChannelGroupId = +this.route.snapshot.paramMap.get('id');
      this.isSelected = selectedChannelGroupId !== 0;
      if (this.isSelected) {
        this.selectChannelGroup(selectedChannelGroupId);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addChannelGroup() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  editChannelGroup() {
    this.router.navigate([`edit`], {relativeTo: this.route});
  }

  // Getting a selected channel group and setting variables
  selectChannelGroup(selectedChannelGroupId: number) {
    this.channelGroupsService.getChannelGroup(selectedChannelGroupId).subscribe( channelGroup => {
      this.selectedChannelGroup = channelGroup;
      this.selectedChannels = this.selectedChannelGroup.channels;
      this.selected = this.channelGroups.filter( cg => { // Select row with channel group
        return (cg.id === this.selectedChannelGroup.id);
      });
    });
  }

  // onSelect function for data table selection
  onSelect($event) { // When a row is selected, route the page and select that channel group
    const selectedId = $event.selected[0].id;
    this.router.navigate([`channel-groups/${selectedId}`], {relativeTo: this.route.root});
    if (this.isSelected) {
      this.selectChannelGroup(selectedId);
    }
  }
}
