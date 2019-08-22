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

@Component({
  selector: 'app-channel-group-edit',
  templateUrl: './channel-groups-edit.component.html',
  styleUrls: ['./channel-groups-edit.component.scss']
}) 
export class ChannelGroupsEditComponent implements OnInit, OnDestroy{
  id: number;
  channelGroup: ChannelGroup;
  editMode : boolean;
  channelGroupForm : FormGroup;
  channelsForm : FormGroup;
  availableChannels : Channel[];
  subscriptions : Subscription = new Subscription();
  filteredChannels : Channel[] = [];
  selectedChannels : Channel[] = [];

  availableNetworks : Network[] = [];
  selectedNetwork : Network;
  filtersForm : FormGroup;

  constructor(  
    private router: Router, 
    private route: ActivatedRoute, 
    private channelGroupService : ChannelGroupsService,
    private channelsService : ChannelsService,
    private formBuilder: FormBuilder,
    private networksService : NetworksService
  ) { }

  ngOnInit() {
    const paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;

        this.initForm();
      }
    );

    const sub1 = this.networksService.networks.subscribe(networks => {
      this.availableNetworks = networks;
      this.filtersForm = this.formBuilder.group({
        "networks": new FormControl([])
      })
    });

    this.subscriptions.add(paramsSub);
    this.subscriptions.add(sub1);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


  //other filters do on front end

  //after filter applied do this 
  getChannelsForNetwork(){

    this.selectedNetwork = this.filtersForm.value.networks;
    if(this.selectedNetwork) {
      this.channelsService.fetchChannels(
        this.selectedNetwork
      );

      let channelsSub = this.channelsService.channels.subscribe(channels => {
        this.availableChannels = channels;
        console.log("Channels");
        this.initChannelsForm();
      });
  
      this.subscriptions.add(channelsSub);
    }

  }


  // Inits group edit form
  private initForm() {
    let channelGroupName = "";
    let channelGroupDescription = "";

    // if editing existing group, populate with the info
    if (this.editMode) {
      this.channelGroupService.getChannelGroup(this.id).subscribe(
        channelGroup => {
          channelGroupName = channelGroup.name;
          channelGroupDescription = channelGroup.description;
          this.selectedChannels = channelGroup.channels;
        }
      );
    }

    this.channelGroupForm = this.formBuilder.group({
      'name' : new FormControl(channelGroupName, Validators.required),
      'description': new FormControl(channelGroupDescription, Validators.required)
    });

  }

  //TODO: break select form into new component
  // Sets up channels form 
  private initChannelsForm() {
    if(this.availableChannels.length > 0) {
      //add availble channels that are not already selected
      this.createChannelSelectors();
    } else {
      this.filteredChannels = [];
      this.channelsForm = this.formBuilder.group({});
    }
  }

  // Creates a form control 
  private createChannelSelectors() {
    this.channelsForm = this.formBuilder.group({});
    let formChannels = new FormArray([]);

    let _filteredChannels = [...this.availableChannels]
      .filter(channel => {
        return !this.contains(this.selectedChannels, channel);
      });

    //Add form control for each channel
    _filteredChannels.map((channel, i) => {
      formChannels.push(new FormControl());
    });

    this.filteredChannels = [..._filteredChannels];
    this.channelsForm.addControl("channels", formChannels);
  }
  
  // TODO: check if this is too slow for large data sets
  // Adds selected channels from form to channel group
  addSelectedChannelsToGroup() {
    //clear form
    //take selected channels
    if (this.channelsForm.value.channels) {
      let _channels = this.channelsForm.value.channels
      .map((value, i) => {
        return value ? this.filteredChannels[i] : null;
      })
      .filter(value => value !== null);

      this.channelsForm.removeControl("channels");

      this.selectedChannels.push(..._channels); 
  
      this.createChannelSelectors();
    
    }

  }

  // Returns true if channel object is in array of channels
  private contains(array: Channel[], channel: Channel) : boolean {
    return array.some(chan => (chan.nslc === channel.nslc));
  }

  // Remove channel from channel group
  removeChannelFromGroup(i: number) {
    //remove channel from selected channels
    this.selectedChannels.splice(i, 1);

    //Add channel back to available 
    this.createChannelSelectors();
  }

  // Save channel information
  save() {
    let values = this.channelGroupForm.value;
    this.channelGroupService.updateChannelGroup(
      new ChannelGroup(
        this.id,
        values.name,
        values.description, 
        this.selectedChannels
      )
    ).subscribe(
      result => {
        this.cancel(result.id)
      }
    );
  }

  // Exit page
  //TODO: warn if unsaved
  cancel(id?: number) {
    if(id && !this.id) {
      this.router.navigate(['../', id], {relativeTo: this.route});
    } else {
      this.router.navigate(['../'], {relativeTo: this.route});
    }
  }
}
