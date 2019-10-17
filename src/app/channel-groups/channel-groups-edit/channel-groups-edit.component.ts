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

  //form stuff
  channelGroupForm: FormGroup;
  availableNetworks: Network[] = [];
  selectedNetwork: Network;
  filtersForm: FormGroup;
  availableChannels: Channel[];
  selectedChannels: Channel[] = [];

  // table stuff
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  SortType = SortType;

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
        this.updateChannels();
      });

      this.subscriptions.add(channelsSub);
    }

  }

  onSelect({ selected }) {
    this.selectedChannels.splice(0, this.selectedChannels.length);
    this.selectedChannels.push(...selected);
  }

  removeChannel(index) {
    this.selectedChannels.splice(index, 1);
    this.updateChannels();
  }

  updateChannels() {
    this.selectedChannels = [...this.selectedChannels];
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
