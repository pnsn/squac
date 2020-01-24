import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChannelGroup } from '../../shared/channel-group';
import { ChannelGroupsService } from '../channel-groups.service';
import { FormGroup, FormControl, FormArray, FormGroupName, Validators, NgForm, FormBuilder } from '@angular/forms';
import { ChannelsService } from '../../shared/channels.service';
import { Channel } from '../../shared/channel';
import { Subscription } from 'rxjs';
import { NetworksService } from '../networks.service';
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
  mapChannels: Channel[] = [];
  availableChannels: Channel[] = [];
  selectedChannels: Channel[] = [];
  selectedChannelIds: number[] = [];
  bounds: any;

  // table stuff
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  SortType = SortType;

  @ViewChild('availableTable', { static: false }) availableTable: any;
  @ViewChild('selectedTable', { static: false }) selectedTable: any;

  removeChannel(channel: Channel) {
    const index = this.selectedChannelIds.indexOf(channel.id);
    this.selectedChannels.splice(index, 1);
    this.selectedChannelIds.splice(index, 1);
    this.selectedChannels = [...this.selectedChannels];
    this.changeMade = true;
  }

  addChannelsToSelected() {
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
    // add available channels to selected channels
    this.changeMade = true;
  }

  updateTable() {
    // unselect existing from table, but don't make more of a search
  }

  ngOnInit() {
    const paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = params.id != null;

        this.initForm();
      }
    );

    this.subscriptions.add(paramsSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // removeChannelsWithFilters(searchFilters) {
  //   console.log(searchFilters);
  //   this.selectedChannels.filter((channel, index)=>{
  //     return


  //   });
  // }

  getChannelsWithFilters(searchFilters) {
    if (searchFilters !== {}) {
      this.loading = true;
      const channelsSub = this.channelsService.getChannelsbyFilters(searchFilters).subscribe(
        response => {
          console.log(response.length);
          this.availableChannels = response;
          this.mapChannels = [...this.availableChannels];
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
      this.mapChannels = [];
    }
  }

  onSelect(event) {
    console.log(event);
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
          this.getIdsFromChannels();
        }
      );
    }
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
    this.channelGroupService.updateChannelGroup(
      new ChannelGroup(
        this.id,
        values.name,
        values.description,
        this.selectedChannels
      )
    ).subscribe(
      result => {
        this.cancel(result.id);
      }
    );
  }

  // Exit page
  // TODO: warn if unsaved
  cancel(id?: number) {
    if (id && !this.id) {
      this.router.navigate(['../../', id], {relativeTo: this.route});
    } else {
      this.router.navigate(['../../', this.id], {relativeTo: this.route});
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
    this.availableChannels = this.mapChannels.filter( channel => {
      const latCheck = channel.lat <= this.bounds.lat_max && channel.lat >= this.bounds.lat_min;
      const lonCheck = channel.lon >= this.bounds.lon_min && channel.lon <= this.bounds.lon_max;
      return latCheck && lonCheck;
    });
  }

  updateBounds(newBounds: string) {
    if (newBounds === '') {
      this.availableChannels = [...this.mapChannels];
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
      if (this.availableChannels === []) {
        // this.getChannelsWithFilters(this.bounds); // Uncomment to make api request for channels in lat lon
      } else {
        this.filterBounds();
      }
    }
  }
}
