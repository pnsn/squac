import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChannelGroup } from '@core/models/channel-group';
import { ChannelGroupsService } from '../../services/channel-groups.service';
import { FormGroup, FormControl, FormArray, FormGroupName, Validators, NgForm, FormBuilder } from '@angular/forms';
import { ChannelsService } from '../../services/channels.service';
import { Channel } from '@core/models/channel';
import { Subscription } from 'rxjs';
import { ColumnMode, SelectionType, SortType } from '@swimlane/ngx-datatable';
import { UserService } from '@features/user/services/user.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { MessageService } from '@core/services/message.service';


@Component({
  selector: 'app-channel-group-edit',
  templateUrl: './channel-groups-edit.component.html',
  styleUrls: ['./channel-groups-edit.component.scss']
})

// TODO: this is getting massive - consider restructuring
export class ChannelGroupsEditComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private channelGroupService: ChannelGroupsService,
    private channelsService: ChannelsService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private confirmDialog: ConfirmDialogService,
    private messageService: MessageService
  ) { }

  id: number;
  channelGroup: ChannelGroup;
  editMode: boolean;
  subscriptions: Subscription = new Subscription();
  loading = false;
  changeMade = false;
  orgId: number;
  // form stuff
  channelGroupForm: FormGroup;
  searchChannels: Channel[] = []; // Channels returned from filter request
  availableChannels: Channel[] = []; // Search channels filtered by bounds
  originalSelectedChannels: Channel[] = []; // Original channels on channel group
  selectedChannels: Channel[] = []; // Channels currently in selected list
  selectedChannelIds: number[] = []; // Channel ids in selected list
  isFilterOpen: boolean; // For setting class of form and table for resizing
  isSelectedFiltered = false; // For remove channels button
  filteredChannels: Channel[] = []; // For filtering selected channels to remove
  previous: { // Last state of selected channels for undo
    selectedChannels: Channel[],
    selectedChannelIds: number[]
  };
  showOnlyCurrent = true;
  filtersChanged: boolean;
  searchFilters: any;
  // Map stuff
  bounds: any; // Latlng bounds to either filter by or make a new request with

  // table stuff
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  SortType = SortType;

  @ViewChild('availableTable') availableTable: any;
  @ViewChild('selectedTable') selectedTable: any;

  ngOnInit() {
    const paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.channelGroupId;
        this.editMode = !!this.id;

        this.initForm();
      }
    );

    // fixme: this shouldn't nee to be in here
    this.orgId = this.userService.userOrg;
    this.isFilterOpen = false;
    this.subscriptions.add(paramsSub);
  }

  // Inits group edit form
  private initForm() {
    this.channelGroupForm = this.formBuilder.group({
      name : new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });

    // if editing existing group, populate with the info
    // TODO: redudant - fix for observable
    if (this.editMode) {
      this.channelGroupService.getChannelGroup(this.id).subscribe(
        channelGroup => {
          this.channelGroupForm.patchValue({
            name : channelGroup.name,
            description : channelGroup.description
          });
          this.channelGroup = channelGroup;
          this.selectedChannels = channelGroup.channels ? [...channelGroup.channels] : [];
          this.originalSelectedChannels = [...this.selectedChannels];
          this.filteredChannels = [...this.selectedChannels];
          this.getIdsFromChannels();
        },
        error => {
          this.messageService.error('Could not load channel group.');
        }
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  removeChannel(channel: Channel) {
    this.previous = {
      selectedChannels: [...this.selectedChannels],
      selectedChannelIds: [...this.selectedChannelIds]
    };
    const index = this.selectedChannelIds.indexOf(channel.id);
    if (index !== -1) {
      this.selectedChannels.splice(index, 1);
      this.selectedChannelIds.splice(index, 1);
      this.filteredChannels = [...this.selectedChannels];
      this.changeMade = true;
    }
  }

  addChannelsToSelected() {
    this.previous = {
      selectedChannels: [...this.selectedChannels],
      selectedChannelIds: [...this.selectedChannelIds]
    };
    const newChannels = this.availableChannels.filter(
      (channel) => {
        if (this.selectedChannelIds.indexOf(channel.id) === -1) {
          this.selectedChannelIds.push(channel.id);
          return true;
        }
        return false;
      }
    );
    this.selectedChannels = [...this.selectedChannels, ...newChannels];
    this.filteredChannels = [...this.selectedChannels];
    // add available channels to selected channels
    this.changeMade = true;
  }

  // Remove stations with offdates before today
  filterCurrent() {
    const current = new Date().getTime();
    this.availableChannels = this.searchChannels.filter( channel => {
      const offDate = new Date(channel.endttime).getTime();
      return this.showOnlyCurrent ? current < offDate : true;
    });
  }

  undoSelectRemove() {
    const newPrevious = {
      selectedChannels: [...this.selectedChannels],
      selectedChannelIds: [...this.selectedChannelIds]
    };
    this.selectedChannels = this.previous.selectedChannels;
    this.filteredChannels = [...this.selectedChannels];
    this.selectedChannelIds = this.previous.selectedChannelIds;
    this.previous = newPrevious;
  }

  getChannelsWithFilters(searchFilters: object) {
    if (this.searchFilters !== {}) {
      this.loading = true;
      const channelsSub = this.channelsService.getChannelsByFilters(searchFilters).subscribe(
        response => {
          this.availableChannels = response;
          this.searchChannels = [...this.availableChannels];
          this.loading = false;
          if (this.bounds !== undefined) {
            this.filterBounds();
          }

          this.filterCurrent();
          // add channels to selected Channels
        }
      );
      this.subscriptions.add(channelsSub);
    } else {
      this.availableChannels = [];
      this.searchChannels = [];
    }

    this.availableChannels = [...this.availableChannels];
  }

  onSelect(event) {
    console.log(event);
  }

  onFilteringOpen() {
    this.isFilterOpen = true;

    this.filteredChannels = [...this.selectedChannels];
  }

  onFilteringClose() {
    this.isFilterOpen = false;
    this.filteredChannels = [...this.selectedChannels];

  }

  onSelectedFilter(searchFilters: object) {
    this.isSelectedFiltered = true; // enable remove button
    const filtersMap = { // convert filter strings to property names
      network: 'networkCode',
      location: 'loc',
      station: 'stationCode'
    };
    if (searchFilters !== {}) {
      this.filteredChannels = this.selectedChannels; // reset filtered channels (list to display)
      for (const filter in searchFilters) {
        if (searchFilters[filter]) {
          if (filter === 'chan_search') {
            const regex = RegExp(searchFilters[filter]);
            this.filteredChannels = this.filteredChannels.filter(chan => {
              return regex.test(chan.code);
            });
          } else {
            const filterParams = searchFilters[filter].split(','); // split string into array of search params
            filterParams.forEach( (param: string) => {
              this.filteredChannels = this.filteredChannels.filter(chan => {
                return chan[filtersMap[filter]] === param;
              });
            });
          }
        }
      }
    }
  }

  removeChannels() {
    this.previous = { // set previous for undo
      selectedChannels: [...this.selectedChannels],
      selectedChannelIds: [...this.selectedChannelIds]
    };
    const chanIdsToRemove = this.filteredChannels.map( c => {
      return c.id; // get ids from filtered channels
    });
    this.filteredChannels = [];
    this.isSelectedFiltered = false;
    this.selectedChannels = this.selectedChannels.filter( channel => {
      return !chanIdsToRemove.some( id => { // remove channels from selected if in filtered
        return channel.id === id;
      });
    });
    this.getIdsFromChannels();
    this.onFilteringClose();
    this.changeMade = true;
  }

  private getIdsFromChannels() {
    this.selectedChannelIds = [];
    this.selectedChannels.forEach(channel => {
      this.selectedChannelIds.push(channel.id);
    });
  }

  // Save channel information
  save() {
    const values = this.channelGroupForm.value;

    const cg = new ChannelGroup(
      this.id,
      null,
      values.name,
      values.description,
      this.orgId,
      this.selectedChannelIds
    );

    this.channelGroupService.updateChannelGroup(cg).subscribe(
      result => {
        this.cancel(result.id);
        this.messageService.message('Channel group saved.');
      },
      error => {
        this.messageService.error('Could not save channel group.');
      }
    );
  }

  // Delete channel group
  delete() {
    this.channelGroupService.deleteChannelGroup(this.id).subscribe(
      result => {
        this.cancel();
        this.messageService.message('Channel group deleted.');
      },
      error => {
        this.messageService.error('Could not delete channel group');
      }
    );
  }

  // Exit page
  // TODO: warn if unsaved
  cancel(id?: number) {
    console.log(id)
    if (id && !this.id) {
      this.router.navigate(['../', id], {relativeTo: this.route});
    } else {
      this.router.navigate(['../'], {relativeTo: this.route});
    }
  }

  // Check if form has unsaved fields
  formUnsaved() {
    if (this.channelGroupForm.dirty || this.changeMade) {
      this.confirmDialog.open(
        {
          title: 'Cancel editing',
          message: 'You have unsaved changes, if you cancel they will be lost.',
          cancelText: 'Keep editing',
          confirmText: 'Cancel'
        }
      );
      this.confirmDialog.confirmed().subscribe(
        confirm => {
          if (confirm) {
            this.cancel();
          }
      });

    } else {
      this.cancel();
    }
  }

  // Give a warning to user that delete will also delete widgets
  onDelete() {
    this.confirmDialog.open(
      {
        title: `Delete ${this.editMode ? this.channelGroup.name : 'Channel Group'}`,
        message: 'Are you sure? This action is permanent.',
        cancelText: 'Cancel',
        confirmText: 'Delete'
      }
    );
    this.confirmDialog.confirmed().subscribe(
      confirm => {
        if (confirm) {
          this.delete();
        }
    });
  }


  // Filter searched channels using the map bounds
  filterBounds() {
    this.availableChannels = this.searchChannels.filter( channel => {
      const latCheck = channel.lat <= this.bounds.lat_max && channel.lat >= this.bounds.lat_min;
      const lonCheck = channel.lon >= this.bounds.lon_min && channel.lon <= this.bounds.lon_max;
      return latCheck && lonCheck;
    });
  }

  // Update bounds for filtering channels with map
  updateBounds(newBounds: string) {
    if (newBounds === '') {
      this.availableChannels = [...this.searchChannels];
    } else {
      const boundsArr = newBounds.split(' ').map(bound => { // format: 'N_lat W_lon S_lat E_lon'
        return parseFloat(bound);
      });
      this.bounds = {
        lat_min: boundsArr[2], // south bound
        lat_max: boundsArr[0], // north bound
        lon_min: boundsArr[1], // west bound
        lon_max: boundsArr[3] // east bound
      };
      if (this.availableChannels.length === 0) {
        this.getChannelsWithFilters(this.bounds); // Uncomment to make api request for channels in lat lon
      } else {
        this.filterBounds();
      }
    }
  }

}
