import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChannelGroup } from '../../shared/channel-group';
import { ChannelGroupsService } from '../channel-groups.service';
import { FormGroup, FormControl, FormArray, FormGroupName, Validators, NgForm, FormBuilder } from '@angular/forms';
import { ChannelsService } from '../../shared/channels.service';
import { Channel } from '../../shared/channel';
import { Subscription } from 'rxjs';
import { ColumnMode, SelectionType, SortType } from '@swimlane/ngx-datatable';


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
    private formBuilder: FormBuilder
  ) { }

  id: number;
  channelGroup: ChannelGroup;
  editMode: boolean;
  subscriptions: Subscription = new Subscription();
  loading = false;
  changeMade = false;

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

  // Map stuff
  isMapShowing: boolean;
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
        this.id = +params.id;
        this.editMode = !!this.id;

        this.initForm();
      }
    );
    this.isFilterOpen = false;
    this.isMapShowing = window.innerWidth >= 1400;
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
          this.selectedChannels = channelGroup.channels ? [...channelGroup.channels] : [];
          this.originalSelectedChannels = [...this.selectedChannels];
          this.filteredChannels = [...this.selectedChannels];
          this.getIdsFromChannels();
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

  updateTable() {
    // unselect existing from table, but don't make more of a search
  }

  getChannelsWithFilters(searchFilters: object) {
    if (searchFilters !== {}) {
      this.loading = true;
      const channelsSub = this.channelsService.getChannelsByFilters(searchFilters).subscribe(
        response => {
          this.availableChannels = response;
          this.searchChannels = [...this.availableChannels];
          this.loading = false;
          if (this.bounds !== undefined) {
            this.filterBounds();
          }
          // add channels to selected Channels
        }
      );
      this.subscriptions.add(channelsSub);
    } else {
      this.availableChannels = [];
      this.searchChannels = [];
    }
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
    console.log(searchFilters);
    const filtersMap = { // convert filter strings to property names
      network: 'networkCode',
      channel: 'code',
      location: 'loc',
      station: 'stationCode'
    };
    if (searchFilters !== {}) {
      this.filteredChannels = []; // reset filtered channels (list to display)
      for (const filter in searchFilters) {
        if (filter !== null) {
          console.log(filter);
          const filterParams = searchFilters[filter].split(','); // split string into array of search params
          filterParams.forEach( (param: string) => {
            this.selectedChannels.forEach( c => {
              const inFiltered = this.filteredChannels.some( filteredChannel => {
                return c.id === filteredChannel.id; // Channel is already in filtered list
              });
              if (!inFiltered) {
                let match: boolean;
                if (filter === 'channel' && searchFilters[filter] !== '' ) {
                  const reg = new RegExp(param.toLowerCase());
                  match = reg.test(c.code);
                } else {
                  match = c[filtersMap[filter]] === param.toLowerCase().trim(); // Channel matches search param
                }
                if (match) { // New channel that matches params
                  console.log(`push: ${c}`);
                  this.filteredChannels.push(c);
                }
              }
            });
          });
          this.filteredChannels = [...this.filteredChannels]; // to update table
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
    this.selectedChannels = this.selectedChannels.filter( channel => {
      return !chanIdsToRemove.some( id => { // remove channels from selected if in filtered
        return channel.id === id;
      });
    });
    this.getIdsFromChannels();
    this.filteredChannels = [...this.selectedChannels]; // reset filtered to current channel list
    this.isSelectedFiltered = false; // disable button until new filter params
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
      this.selectedChannels
    );

    this.channelGroupService.updateChannelGroup(cg).subscribe(
      result => {
        this.cancel(result.id);
      }
    );
  }

  // Exit page
  // TODO: warn if unsaved
  cancel(id?: number) {
    if (id && !this.id) {
      this.router.navigate(['../', id], {relativeTo: this.route});
    } else if (id) {
      this.router.navigate(['../'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../'], {relativeTo: this.route});
    }
  }
  // Check if form has unsaved fields
  formUnsaved() {
    if (this.channelGroupForm.dirty || this.changeMade) {
      const popup = document.getElementById('channel-group-popup');
      popup.style.display = 'block';
    } else {
      this.cancel();
    }
  }

  closePopup() {
    const popup = document.getElementById('channel-group-popup');
    popup.style.display = 'none';
  }

  filterBounds() {
    this.availableChannels = this.searchChannels.filter( channel => {
      const latCheck = channel.lat <= this.bounds.lat_max && channel.lat >= this.bounds.lat_min;
      const lonCheck = channel.lon >= this.bounds.lon_min && channel.lon <= this.bounds.lon_max;
      return latCheck && lonCheck;
    });
  }

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

  onResize(event: any) {
    const willMapShow = event.target.innerWidth >= 1400;
    if (!this.isMapShowing && willMapShow) {
      this.isFilterOpen = false;
    }
    this.isMapShowing = willMapShow;
  }
}
