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
  
  selectedChannels : Channel[];

  constructor(  
    private router: Router, 
    private route: ActivatedRoute, 
    private channelGroupService : ChannelGroupsService,
    private channelsService : ChannelsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    const sub1 = this.channelsService.channels.subscribe(channels => {
      this.availableChannels = channels;
      this.initChannelsForm();
    })

    const sub2 = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;

        this.initForm();
      }
    )
    this.subscriptions.add(sub1);
    this.subscriptions.add(sub2);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private initForm() {
    let channelGroupName = "";
    let channelGroupDescription = "";

    if (this.editMode) {
      const channelGroup = this.channelGroupService.getChannelGroup(this.id);
      channelGroupName = channelGroup.name;
      channelGroupDescription = channelGroup.description;
    }

    this.channelGroupForm = this.formBuilder.group({
      'name' : new FormControl(channelGroupName, Validators.required),
      'description': new FormControl(channelGroupDescription, Validators.required)
    });

  }

  //TODO: break into new component
  private initChannelsForm() {

    this.channelsForm = this.formBuilder.group({
      'channels' : new FormArray([])
    });

    this.availableChannels.map((o, i) => {
      const control = new FormControl(); // if first item set to true, else false
      (this.channelsForm.controls.channels as FormArray).push(control);
    });

  }
  
  addSelectedChannels() {
    this.selectedChannels =  this.channelsForm.value.channels
      .map((v, i) => v ? this.availableChannels[i] : null)
      .filter(v => v !== null);
  }

  save() {
    //save channel
    this.channelGroupService.updateChannelGroup(this.id, this.channelGroupForm.value, this.selectedChannels);
    this.cancel();
  }

  cancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
