import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChannelGroup } from '../../shared/channel-group';
import { ChannelGroupsService } from '../../shared/channel-groups.service';
import { FormGroup, FormControl, FormArray, FormGroupName, Validators, NgForm, FormBuilder } from '@angular/forms';
import { ChannelsService } from '../../shared/channels.service';
import { Channel } from '../../shared/channel';
import { Subscription } from 'rxjs';

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
  filteredChannels : Channel[];
  selectedChannels : Channel[];

  constructor(  
    private router: Router, 
    private route: ActivatedRoute, 
    private channelGroupService : ChannelGroupsService,
    private channelsService : ChannelsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    const sub2 = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;

        this.initForm();
      }
    );

    const sub1 = this.channelsService.channels.subscribe(channels => {
      this.availableChannels = channels;
      this.initChannelsForm();
    });
    this.subscriptions.add(sub1);
    this.subscriptions.add(sub2);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


  // Inits group edit form
  private initForm() {
    let channelGroupName = "";
    let channelGroupDescription = "";

    // if editing existing group, populate with the info
    if (this.editMode) {
      const channelGroup = this.channelGroupService.getChannelGroup(this.id);
      channelGroupName = channelGroup.name;
      channelGroupDescription = channelGroup.description;
      this.selectedChannels = channelGroup.channels;
    }

    this.channelGroupForm = this.formBuilder.group({
      'name' : new FormControl(channelGroupName, Validators.required),
      'description': new FormControl(channelGroupDescription, Validators.required)
    });

  }

  //TODO: break select form into new component
  // Sets up channels form 
  private initChannelsForm() {

    //initiate form
    this.channelsForm = this.formBuilder.group({
      'channels' : new FormArray([])
    });

    //add availble channels that are not already selected
    this.filteredChannels = [...this.availableChannels]
      .filter(channel => {
        return !this.contains(this.selectedChannels, channel);
      });

    //Add form control for each channel
    this.filteredChannels.map((channel, i) => {
      this.addChannelToForm(channel);
    });
  }

  // Creates a form control 
  private addChannelToForm(channel) {
    const control = new FormControl(); // if first item set to true, else false
    (this.channelsForm.controls.channels as FormArray).push(control);
  }

  // Adds selected channels from form to channel group
  addSelectedChannels() {

    // Take selected channels
    let chans = this.channelsForm.value.channels
      .map((value, i) => {
        if (value) {
          // and remove them from form
          (this.channelsForm.controls.channels as FormArray).removeAt(i);
          let chan = this.filteredChannels[i]
          this.filteredChannels.splice(i, 1);
          return chan;
        }         
        return null;
      })
      .filter(v => v !== null);

    // Add channel to group
    this.selectedChannels.push(...chans);  
  }

  // Save channel information
  save() {
    this.channelGroupService.updateChannelGroup(this.id, this.channelGroupForm.value, this.selectedChannels);
    this.cancel();
  }

  // Exit page
  //TODO: warn if unsaved
  cancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  // Returns true if channel object is in array of channels
  private contains(array: Channel[], channel: Channel) : boolean {
    return array.some(chan => (chan.nslc === channel.nslc));
  }

  // Remove channel from station
  removeChannel(channel: Channel) {

    //remove channel from selected channels
    this.selectedChannels.splice(this.selectedChannels.indexOf(channel), 1);
    
    //Add channel back to available 
    this.addChannelToForm(channel);
    this.filteredChannels.push(channel);
  }

}
