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
    private formBuilder: FormBuilder,
    private networksService: NetworksService
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
    console.log(this.selectedChannels, this.selectedChannelIds);
    const index = this.selectedChannelIds.indexOf(channel.id);
    console.log(index);
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
          this.selectedChannels = channelGroup.channels ? channelGroup.channels : [];
          this.getIdsFromChannels();
        }
      );
    }
  }

  private getIdsFromChannels() {
    this.selectedChannels.forEach(channel => {
      this.selectedChannelIds = [];
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
      this.router.navigate(['../', id], {relativeTo: this.route});
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

  updateBounds(bounds) {
    if (bounds === '') {
      this.availableChannels = [...this.mapChannels];
    } else {
      const boundsArr = bounds.split(' ');
      boundsArr.map( bound => {
        return parseFloat(bound);
      });
      this.availableChannels = this.mapChannels.filter( channel => {
        const latCheck = channel.lat <= boundsArr[0] && channel.lat >= boundsArr[2];
        const lngCheck = channel.lon >= boundsArr[1] && channel.lon <= boundsArr[3];
        return latCheck && lngCheck;
      });
    }
  }
}
