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
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

class Filter {
  value: string;
  add: boolean;
  type: string;
}

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
  availableNetworks: Network[] = [];
  selectedNetwork: Network;
  filtersForm: FormGroup;
  availableChannels: Channel[];
  selectedChannels: Channel[] = [];
  excludedChannels: Channel[] = [];
  allChannels: Channel[];
  selectedChannelIds: number[] = [];
  filterMode : string = "include";
  
  visible = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];

  filters = {
    "network" : [],
    "channel": [],
    "station": [],
    "location": []
  }

  add(event: MatChipInputEvent, type: string): void {
    const input = event.input;
    const value = event.value;
    console.log(type)
    // Add our fruit
    if ((value || '').trim()) {
      this.filters[type].push({
        value: value.trim(),
        type: type,
        add: this.filterMode == "include"
      });
      if(this.filterMode === "include") {
        this.updateFilters();
      } else {
        this.updateTable();
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(filter: Filter, groupKey: any): void {
    const index = this.filters[groupKey].indexOf(filter);

    if (index >= 0) {
      this.filters[groupKey].splice(index, 1);
      this.updateFilters();
    }
  }


  updateFilters(){
    this.loading=true;
    this.getChannelsWithFilters();
    //take all fi;lters and use them
    console.log(this.filters)

  }
  updateTable(){
    //unselect existing from table, but don't make more of a search
  }

  // table stuff
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  SortType = SortType;

  @ViewChild('channelTable', { static: false }) table: any;

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


  // other filters do on front end

  // after filter applied do this
  getChannelsWithFilters() {
    const searchFilters = {};

    for(let filterGroup in this.filters) {
      if(this.filters[filterGroup].length > 0) {
        let filterStr = "";
        for(let filter of this.filters[filterGroup]) {
          if(filter.add) {
            filterStr += filter.value.toLowerCase();
          }
        }
      }

    }
    
    const channelsSub = this.channelsService.getChannelsbyFilters(searchFilters).subscribe(
      response => {
        const newChannels = response.filter(
          (channel)=>{
            if(this.selectedChannelIds.indexOf(channel.id) === -1) {
              this.selectedChannelIds.push(channel.id);
              return true;
            }
            return false;
          }
        )
        console.log(newChannels);
        this.availableChannels = [...newChannels];
        //add channels to selected Channels 
      }
    )

    this.subscriptions.add(channelsSub);
    console.log(searchFilters);
  }

  excludeChannel({selected}) {
    if(selected.length > 0) {
      const latest = selected[selected.length - 1];
    
      this.excludedChannels = [];
      this.excludedChannels.push(...selected);
  
      this.selectedChannelIds.splice(this.selectedChannelIds.indexOf(latest.id), 1);
      this.updateChannels();
    }

  }

  removeChannel(index) {
    console.log(index);
    const includeChannel = this.excludedChannels.splice(index, 1);
    if(includeChannel[0]) {
      this.selectedChannelIds.push(includeChannel[0].id);
    }

    
    this.updateChannels();
  }

  updateChannels() {
    this.excludedChannels = [...this.excludedChannels];
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
          this.availableChannels = channelGroup.channels ? channelGroup.channels : [];
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

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
    return false;
  }
}
