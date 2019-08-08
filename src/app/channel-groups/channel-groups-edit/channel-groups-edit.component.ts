import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChannelGroup } from '../../shared/channel-group';
import { ChannelGroupsService } from '../../shared/channel-groups.service';
import { FormGroup, FormControl, FormArray, FormGroupName, Validators } from '@angular/forms';

@Component({
  selector: 'app-channel-group-edit',
  templateUrl: './channel-groups-edit.component.html',
  styleUrls: ['./channel-groups-edit.component.scss']
}) 
export class ChannelGroupsEditComponent implements OnInit {
  id: number;
  channelGroup: ChannelGroup;
  editMode : boolean;
  channelGroupForm : FormGroup;
  constructor(private router: Router, private route: ActivatedRoute, private channelGroupService : ChannelGroupsService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;

        this.initForm();
      }
    )
  }

  private initForm() {
    let channelGroupName = "";

    if (this.editMode) {
      const channelGroup = this.channelGroupService.getChannelGroup(this.id);
      channelGroupName = channelGroup.name;
    }

    this.channelGroupForm = new FormGroup({
      'name' : new FormControl(channelGroupName, Validators.required)
    });
  }

  save() {
    //save channel
    this.channelGroupService.updateChannelGroup(this.id, this.channelGroupForm.value);
    this.cancel();
  }

  cancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
