import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ChannelGroup } from "@core/models/channel-group";
import { ChannelGroupService } from "@channelGroup/services/channel-group.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ChannelService } from "@channelGroup/services/channel.service";
import { Channel } from "@core/models/channel";
import { Subscription } from "rxjs";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { UserService } from "@user/services/user.service";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MessageService } from "@core/services/message.service";

@Component({
  selector: "channel-group-edit",
  templateUrl: "./channel-group-edit.component.html",
  styleUrls: ["./channel-group-edit.component.scss"],
})
// TODO: this is getting massive - consider restructuring
export class ChannelGroupEditComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  id: number;
  channelGroup: ChannelGroup;
  editMode: boolean; //create group or edit group
  loading = false;
  changeMade = false;
  orgId: number;
  showOnlyCurrent = true; // Filter out not-current channels
  searchFilters: any;

  channelGroupForm: FormGroup; // form stuff

  channelsInGroup: Channel[] = []; // channels currently saved in group
  selectedChannels: Channel[] = []; // Channels currently in selected list
  selectedInGroupChannels: Channel[] = []; // Channels selected from group table
  previousChannels: Channel[]; // Store last version of channels for undo

  // Map stuff
  showChannel: Channel; // Channel to show on map
  bounds: any; // Latlng bounds to either filter by or make a new request with

  // table stuff
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  SortType = SortType;
  columns: any = [];
  rows: Channel[] = [];

  @ViewChild("availableTable") availableTable: any;
  @ViewChild("selectedTable") selectedTable: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private channelGroupService: ChannelGroupService,
    private channelService: ChannelService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private confirmDialog: ConfirmDialogService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // listen to route param
    const paramsSub = this.route.params.subscribe((params: Params) => {
      this.id = +params.channelGroupId;
      this.editMode = !!this.id;

      this.initForm();
    });

    // get orgId
    this.orgId = this.userService.userOrg;
    this.subscriptions.add(paramsSub);

    // table columns
    this.columns = [
      {
        width: 30,
        canAutoResize: false,
        sortable: false,
        draggable: false,
        resizeable: false,
        headerCheckboxable: true,
        checkboxable: true,
      },

      {
        name: "Network",
        prop: "networkCode",
        draggable: false,
        sortable: true,
        resizeable: false,
        pipe: {
          transform: (value) => {
            return value.toUpperCase();
          },
        },
        flexGrow: 1,
      },
      {
        name: "Station",
        prop: "stationCode",
        draggable: false,
        sortable: true,
        resizeable: false,
        flexGrow: 1,
        pipe: {
          transform: (value) => {
            return value.toUpperCase();
          },
        },
      },
      {
        name: "Location",
        prop: "loc",
        draggable: false,
        sortable: true,
        resizeable: false,
        flexGrow: 1,
        pipe: {
          transform: (value) => {
            return value.toUpperCase();
          },
        },
      },
      {
        name: "Channel",
        prop: "code",
        draggable: false,
        sortable: true,
        resizeable: false,
        flexGrow: 1,
        pipe: {
          transform: (value) => {
            return value.toUpperCase();
          },
        },
      },
    ];
  }

  // Inits group edit form
  private initForm(): void {
    this.channelGroupForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
    });

    // if editing existing group, populate with the info
    if (this.editMode) {
      this.channelGroupService.getChannelGroup(this.id).subscribe({
        next: (channelGroup) => {
          this.channelGroupForm.patchValue({
            name: channelGroup.name,
            description: channelGroup.description,
          });
          this.channelGroup = channelGroup;
          this.channelsInGroup = [...channelGroup.channels];
        },
        error: () => {
          this.messageService.error("Could not load channel group.");
        },
      });
    }
  }

  // add selected channels to the group channels
  addChannels(): void {
    this.previousChannels = [...this.channelsInGroup];
    //TODO: previous
    this.changeMade = true;
    const addChannels = this.findChannelsInGroup();
    this.channelsInGroup = [...this.channelsInGroup, ...addChannels];
    this.selectedChannels = [];
  }

  // returns channels that are not already in groupChannels
  private findChannelsInGroup(): Channel[] {
    return this.selectedChannels.filter((channel) => {
      const index = this.channelsInGroup.findIndex((c) => c.id === channel.id);
      return index === -1;
    });
  }

  // returns channels that are in not selectedChannels
  private findChannelsInSelected(): Channel[] {
    return this.channelsInGroup.filter((channel) => {
      const index = this.selectedInGroupChannels.findIndex(
        (c) => c.id === channel.id
      );
      return index === -1;
    });
  }

  // remove all selected channels from the channels in group
  removeChannels(): void {
    this.previousChannels = [...this.channelsInGroup];
    const afterRemove = this.findChannelsInSelected();
    this.channelsInGroup = [...afterRemove];
    this.changeMade = true;
  }

  // Remove stations with offdates before today
  filterCurrent(): void {
    const current = new Date().getTime();
    const temp = this.rows.filter((channel) => {
      const offDate = new Date(channel.endttime).getTime();
      return this.showOnlyCurrent ? current < offDate : true;
    });
    this.rows = [...temp];
  }

  // restore channels to last version
  undoSelectRemove(): void {
    const newPrevious = [...this.channelsInGroup];
    this.channelsInGroup = [...this.previousChannels];
    this.previousChannels = newPrevious;
  }

  // row selected on table
  selectRow($event): void {
    this.showChannel = this.selectedChannels[this.selectedChannels.length - 1];
    this.selectedChannels = [...$event.selected];
  }

  // filters changed in filter componenet
  filtersChanged(searchFilters: any): void {
    this.searchFilters = searchFilters;

    this.getChannelsWithFilters();
  }

  // get channels with filters and/or bounds
  getChannelsWithFilters(): void {
    const searchFilters = { ...this.bounds, ...this.searchFilters };
    if (Object.keys(searchFilters).length !== 0) {
      this.loading = true;
      const channelsSub = this.channelService
        .getChannelsByFilters(searchFilters)
        .subscribe({
          next: (response) => {
            this.selectedChannels = [...response];
            this.rows = [...this.selectedChannels];
            //select retunred rows that are in group

            this.filterCurrent();
            // add channels to selected Channels
          },
          complete: () => {
            this.loading = false;
          },
        });
      this.subscriptions.add(channelsSub);
    } else {
      this.selectedChannels = [];
      this.rows = [...this.selectedChannels];
    }
  }

  // Save channel information
  save(): void {
    const values = this.channelGroupForm.value;
    const selectedChannelIds = this.channelsInGroup.map(
      (channel) => channel.id
    );

    const cg = new ChannelGroup(
      this.id,
      null,
      values.name,
      values.description,
      this.orgId,
      selectedChannelIds
    );

    this.channelGroupService.updateChannelGroup(cg).subscribe({
      next: (result) => {
        this.changeMade = false;
        this.cancel(result.id);
        this.messageService.message("Channel group saved.");
      },
      error: () => {
        this.messageService.error("Could not save channel group.");
      },
    });
  }

  // Delete channel group
  delete(): void {
    this.channelGroupService.deleteChannelGroup(this.id).subscribe({
      next: () => {
        this.cancel();
        this.messageService.message("Channel group deleted.");
      },
      error: () => {
        this.messageService.error("Could not delete channel group");
      },
    });
  }

  // Exit page
  cancel(id?: number): void {
    if (id && !this.id) {
      this.router.navigate(["../", id], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }

  // Check if form has unsaved fields
  formUnsaved(): void {
    if (this.channelGroupForm.dirty || this.changeMade) {
      this.confirmDialog.open({
        title: "Cancel editing",
        message: "You have unsaved changes, if you cancel they will be lost.",
        cancelText: "Keep editing",
        confirmText: "Cancel",
      });
      this.confirmDialog.confirmed().subscribe({
        next: (confirm) => {
          if (confirm) {
            this.cancel();
          }
        },
      });
    } else {
      this.cancel();
    }
  }

  // Give a warning to user that delete will also delete widgets
  onDelete(): void {
    this.confirmDialog.open({
      title: `Delete ${
        this.editMode ? this.channelGroup.name : "Channel Group"
      }`,
      message: "Are you sure? This action is permanent.",
      cancelText: "Cancel",
      confirmText: "Delete",
    });
    this.confirmDialog.confirmed().subscribe({
      next: (confirm) => {
        if (confirm) {
          this.delete();
        }
      },
    });
  }

  // Filter searched channels using the map bounds
  filterBounds(): void {
    const temp = this.selectedChannels.filter((channel) => {
      const latCheck =
        channel.lat <= this.bounds.lat_max &&
        channel.lat >= this.bounds.lat_min;
      const lonCheck =
        channel.lon >= this.bounds.lon_min &&
        channel.lon <= this.bounds.lon_max;
      return latCheck && lonCheck;
    });

    this.selectedChannels = temp;
  }

  // Update bounds for filtering channels with map
  updateBounds(newBounds: string): void {
    if (!newBounds) {
      this.bounds = {};
      this.rows = [...this.selectedChannels];
    } else {
      const boundsArr = newBounds.split(" ").map((bound) => {
        // format: 'N_lat W_lon S_lat E_lon'
        return parseFloat(bound);
      });
      this.bounds = {
        lat_min: boundsArr[2], // south bound
        lat_max: boundsArr[0], // north bound
        lon_min: boundsArr[1], // west bound
        lon_max: boundsArr[3], // east bound
      };
      this.getChannelsWithFilters();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
