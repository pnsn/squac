import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChannelGroup } from '../../shared/channel-group';
import { ChannelGroupsService } from '../channel-groups.service';
import { FormGroup, FormControl, FormArray, FormGroupName, Validators, NgForm, FormBuilder } from '@angular/forms';
import { ChannelsService } from '../../shared/channels.service';
import { Channel } from '../../shared/channel';
import { Subscription } from 'rxjs';
import { Network } from '../network';
import { NetworksService } from '../networks.service';
import { ColumnMode, SelectionType, SortType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-channel-group-edit',
  templateUrl: './channel-groups-edit.component.html',
  styleUrls: ['./channel-groups-edit.component.scss']
})

// TODO: this is getting massive - consider restructuring
export class ChannelGroupsEditComponent implements OnInit, OnDestroy {
  id: number;
  channelGroup: ChannelGroup;
  editMode: boolean;
  channelGroupForm: FormGroup;
  channelsForm: FormGroup;
  availableChannels: Channel[];
  subscriptions: Subscription = new Subscription();
  filteredChannels: Channel[] = [];
  selectedChannels: Channel[] = [];
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  SortType = SortType;


  selected=[];
  availableNetworks: Network[] = [];
  selectedNetwork: Network;
  filtersForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private channelGroupService: ChannelGroupsService,
    private channelsService: ChannelsService,
    private formBuilder: FormBuilder,
    private networksService: NetworksService
  ) { }

  ngOnInit() {
    const paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = params.id != null;

        this.initForm();
      }
    );

    const sub1 = this.networksService.networks.subscribe(networks => {
      this.availableNetworks = networks;
      this.filtersForm = this.formBuilder.group({
        networks: new FormControl([])
      });
    });

    this.subscriptions.add(paramsSub);
    this.subscriptions.add(sub1);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


  // other filters do on front end

  // after filter applied do this
  getChannelsForNetwork() {

    this.selectedNetwork = this.filtersForm.value.networks;
    if (this.selectedNetwork) {
      this.channelsService.fetchChannels(
        this.selectedNetwork
      );

      const channelsSub = this.channelsService.channels.subscribe(channels => {
        this.availableChannels = channels;
        this.initChannelsForm();
      });

      this.subscriptions.add(channelsSub);
    }

  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    console.log(this.selected)
    this.selected.push(...selected);
  }

  remove() {
    this.selected = [];
    console.log("remoce")
  }

  removeItem(index) {
    this.selected.splice(index, 1);
    this.selected = [...this.selected];
  }

  add() {
    console.log("add")
    // this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    console.log("update")
    // this.selected = [this.rows[1], this.rows[3]];
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
          this.selectedChannels = channelGroup.channels ? channelGroup.channels : [];
        }
      );
    }

  }

  // TODO: break select form into new component
  // Sets up channels form
  private initChannelsForm() {
    if (this.availableChannels.length > 0) {
      // add availble channels that are not already selected
      this.createChannelSelectors();
    } else {
      this.filteredChannels = [];
      this.channelsForm = this.formBuilder.group({});
    }
  }

  // Creates a form control
  private createChannelSelectors() {
    this.channelsForm = this.formBuilder.group({});
    const formChannels = new FormArray([]);
    const filteredChannels = [...this.availableChannels]
      .filter(channel => {
        return !this.contains(this.selectedChannels, channel);
      });

    // Add form control for each channel
    filteredChannels.map((channel, i) => {
      formChannels.push(new FormControl());
    });

    this.filteredChannels = [...filteredChannels];
    this.channelsForm.addControl('channels', formChannels);
  }

  // TODO: check if this is too slow for large data sets
  // Adds selected channels from form to channel group
  addSelectedChannelsToGroup() {
    // clear form
    // take selected channels
    if (this.channelsForm.value.channels) {
      const channels = this.channelsForm.value.channels
      .map((value, i) => {
        return value ? this.filteredChannels[i] : null;
      })
      .filter(value => value !== null);

      this.channelsForm.removeControl('channels');

      this.selectedChannels.push(...channels);

      this.createChannelSelectors();

    }

  }

  // Returns true if channel object is in array of channels
  private contains(array: Channel[], channel: Channel): boolean {
    return array.some(chan => (chan.nslc === channel.nslc));
  }

  // Remove channel from channel group
  removeChannelFromGroup(i: number) {
    // remove channel from selected channels
    this.selectedChannels.splice(i, 1);

    // Add channel back to available
    this.createChannelSelectors();
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
      this.router.navigate(['../', id], {relativeTo: this.route});
    } else {
      this.router.navigate(['../'], {relativeTo: this.route});
    }
  }
}
