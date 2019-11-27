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
  subscriptions: Subscription = new Subscription();
  loading: boolean = false;
  // form stuff
  channelGroupForm: FormGroup;

  availableChannels: Channel[] = [];
  selectedChannels: Channel[] = [];

  selectedChannelIds: number[] = [];

  removeChannel(channel: Channel) {
    console.log(this.selectedChannels, this.selectedChannelIds);
    const index = this.selectedChannelIds.indexOf(channel.id);
    console.log(index)
    this.selectedChannels.splice(index, 1);
    this.selectedChannelIds.splice(index, 1);

    this.selectedChannels=[...this.selectedChannels];
  }

  addChannelsToSelected() {
    const newChannels = this.availableChannels.filter(
      (channel)=>{
        if(this.selectedChannelIds.indexOf(channel.id) === -1) {
          this.selectedChannelIds.push(channel.id);
          return true;
        }
        return false;
      }
    )

    this.selectedChannels = [...this.selectedChannels, ...newChannels];
    //add available channels to selected channels
  }

  updateTable(){
    //unselect existing from table, but don't make more of a search
  }

  // table stuff
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  SortType = SortType;

  @ViewChild('availableTable', { static: false }) availableTable: any;
  @ViewChild('selectedTable', { static: false }) selectedTable: any;
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

    this.subscriptions.add(paramsSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  removeChannelsWithFilters(searchFilters) {
    console.log(searchFilters);
  }

  getChannelsWithFilters(searchFilters) {

    console.log(searchFilters);
    const channelsSub = this.channelsService.getChannelsbyFilters(searchFilters).subscribe(
      response => {

        this.availableChannels = response;
        //add channels to selected Channels 
      }
    )

    this.subscriptions.add(channelsSub);
    console.log(searchFilters);
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

  // Save channel information
  save() {
    const values = this.channelGroupForm.value;
    console.log(values.name, values.description, this.selectedChannelIds);
    // this.channelGroupService.updateChannelGroup(
    //   new ChannelGroup(
    //     this.id,
    //     values.name,
    //     values.description,
    //     this.selectedChannels
    //   )
    // ).subscribe(
    //   result => {
    //     this.cancel(result.id);
    //   }
    // );
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
  // Check if form has unsaved fields
  formUnsaved() {
    if (this.channelGroupForm.dirty) {
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

  toggleExpandGroup(group, type) {
    if(type === "available") {
      this.availableTable.availableGroupHeader.toggleExpandGroup(group);
    } else {
      this.selectedTable.selectedGroupHeader.toggleExpandGroup(group);
    }
    return false;
  }

}
