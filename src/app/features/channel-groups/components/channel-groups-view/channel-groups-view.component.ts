import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChannelGroup } from '@core/models/channel-group';
import { Channel } from '@core/models/channel';
import { Subscription } from 'rxjs';
import { ChannelGroupsService } from '../../services/channel-groups.service';
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
  subscription: Subscription = new Subscription();
  selectedChannelGroupId: number;
  selectedChannels = [];

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

    this.channelGroups = this.route.parent.snapshot.data.channelGroups;
    console.log(this.channelGroups)
    if(this.route.firstChild){
      this.selectedChannelGroupId = +this.route.firstChild.snapshot.params['id'];
      this.selectChannelGroup(this.selectedChannelGroupId);
    }

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addChannelGroup() {
    if (!!this.selectedChannelGroupId) {
      this.router.navigate(['../new'], {relativeTo: this.route});
    } else {
      this.router.navigate(['new'], {relativeTo: this.route});
    }
  }

  editChannelGroup() {
    this.router.navigate([`edit`], {relativeTo: this.route});
  }

  // Getting a selected channel group and setting variables
  selectChannelGroup(selectedChannelGroupId: number) {
    this.selected = this.channelGroups.filter( cg => { // Select row with channel group
      return (cg.id === selectedChannelGroupId);
    });
  }

  // onSelect function for data table selection
  onSelect($event) { // When a row is selected, route the page and select that channel group
    const selectedId = $event.selected[0].id;
    if (selectedId) {
      this.router.navigate(['channel-groups', selectedId], {relativeTo: this.route.root});
      this.selectedChannelGroupId = selectedId;
      this.selectChannelGroup(selectedId);
    }
  }
}
