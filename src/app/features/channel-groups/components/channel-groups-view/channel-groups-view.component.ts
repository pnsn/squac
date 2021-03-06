import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ChannelGroup } from '@core/models/channel-group';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { OrganizationsService } from '@features/user/services/organizations.service';

@Component({
  selector: 'app-channel-groups-view',
  templateUrl: './channel-groups-view.component.html',
  styleUrls: ['./channel-groups-view.component.scss']
})
export class ChannelGroupsViewComponent implements OnInit, OnDestroy, AfterViewInit {
  channelGroups: ChannelGroup[];
  selected: ChannelGroup[];
  subscription: Subscription = new Subscription();
  selectedChannelGroupId: number;
  selectedChannels = [];

  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orgService: OrganizationsService
  ) { }

  ngOnInit() {
    this.selected = [];

    this.channelGroups = this.route.parent.snapshot.data.channelGroups;
    if (this.route.firstChild) {
      this.selectedChannelGroupId = +this.route.firstChild.snapshot.params.id;
      this.selectChannelGroup(this.selectedChannelGroupId);
    }

  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.selected = [...this.selected];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addChannelGroup() {
    this.router.navigate(['new'], {relativeTo: this.route});
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
      this.router.navigate([selectedId], {relativeTo: this.route});
      this.selectedChannelGroupId = selectedId;
      this.selectChannelGroup(selectedId);
    }
  }
}
