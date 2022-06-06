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

  id: number;
  channelGroup: ChannelGroup;
  editMode: boolean;
  subscriptions: Subscription = new Subscription();
  loading = false;
  changeMade = false;
  orgId: number;
  // form stuff
  channelGroupForm: FormGroup;
  searchChannels: Channel[] = []; // Channels returned from filter request
  availableChannels: Channel[] = []; // Search channels filtered by bounds
  originalSelectedChannels: Channel[] = []; // Original channels on channel group
  selectedChannels: Channel[] = []; // Channels currently in selected list

  isSelectedFiltered = false; // For remove channels button
  filteredChannels: Channel[] = []; // For filtering selected channels to remove
  previousChannels: Channel[];
  showOnlyCurrent = true;
  filtersChanged: boolean;
  searchFilters: any;
  // Map stuff
  bounds: any; // Latlng bounds to either filter by or make a new request with

  // table stuff
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  SortType = SortType;
  columns = [];

  channelsInGroup: Channel[] = [];
  rows: Channel[] = [];

  @ViewChild("availableTable") availableTable: any;
  @ViewChild("selectedTable") selectedTable: any;

  ngOnInit() {
    const paramsSub = this.route.params.subscribe((params: Params) => {
      this.id = +params.channelGroupId;
      this.editMode = !!this.id;

      this.initForm();
    });

    // fixme: this shouldn't nee to be in here
    this.orgId = this.userService.userOrg;
    this.subscriptions.add(paramsSub);

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
  private initForm() {
    this.channelGroupForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
    });

    // if editing existing group, populate with the info
    // TODO: redudant - fix for observable
    if (this.editMode) {
      this.channelGroupService.getChannelGroup(this.id).subscribe({
        next: (channelGroup) => {
          this.channelGroupForm.patchValue({
            name: channelGroup.name,
            description: channelGroup.description,
          });
          this.channelGroup = channelGroup;
          this.channelsInGroup = [...channelGroup.channels];
          this.updateRows();
        },
        error: () => {
          this.messageService.error("Could not load channel group.");
        },
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  addChannels() {
    //combine selected and saved();
    this.previousChannels = [...this.channelsInGroup];
    //TODO: previous
    this.changeMade = true;
    const addChannels = this.findChannelsInGroup();
    this.channelsInGroup = [...this.channelsInGroup, ...addChannels];

    this.updateRows();
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
      const index = this.selectedChannels.findIndex((c) => c.id === channel.id);
      return index === -1;
    });
  }

  //TODO: previous
  removeChannels() {
    this.previousChannels = [...this.channelsInGroup];
    const afterRemove = this.findChannelsInSelected();
    this.channelsInGroup = [...afterRemove];
    this.changeMade = true;
    this.updateRows();
  }

  // Remove stations with offdates before today
  filterCurrent() {
    const current = new Date().getTime();
    const temp = this.rows.filter((channel) => {
      const offDate = new Date(channel.endttime).getTime();
      return this.showOnlyCurrent ? current < offDate : true;
    });
    this.rows = [...temp];
  }

  undoSelectRemove() {
    const newPrevious = [...this.channelsInGroup];
    this.channelsInGroup = [...this.previousChannels];
    this.previousChannels = newPrevious;
  }

  updateRows() {
    this.rows = [...this.channelsInGroup];
    this.selectedChannels = [];
  }

  selectRow($event) {
    this.selectedChannels = [...$event.selected];
  }
  getChannelsWithFilters(searchFilters: object) {
    let searchResults = [];
    if (this.searchFilters !== {}) {
      this.loading = true;
      const channelsSub = this.channelService
        .getChannelsByFilters(searchFilters)
        .subscribe((response) => {
          searchResults = [...response];
          this.loading = false;

          this.selectedChannels = [...searchResults];

          const existing = this.findChannelsInSelected();
          this.rows = [...this.selectedChannels, ...existing];
          //select retunred rows that are in group
          if (this.bounds !== undefined) {
            this.filterBounds();
          }

          this.filterCurrent();
          // add channels to selected Channels
        });
      this.subscriptions.add(channelsSub);
    } else {
      searchResults = [];
    }
  }

  // Save channel information
  save() {
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

    this.channelGroupService.updateChannelGroup(cg).subscribe(
      (result) => {
        this.changeMade = false;
        this.cancel(result.id);
        this.messageService.message("Channel group saved.");
      },
      () => {
        this.messageService.error("Could not save channel group.");
      }
    );
  }

  // Delete channel group
  delete() {
    this.channelGroupService.deleteChannelGroup(this.id).subscribe(
      () => {
        this.cancel();
        this.messageService.message("Channel group deleted.");
      },
      () => {
        this.messageService.error("Could not delete channel group");
      }
    );
  }

  // Exit page
  // TODO: warn if unsaved
  cancel(id?: number) {
    if (id && !this.id) {
      this.router.navigate(["../", id], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }

  // Check if form has unsaved fields
  formUnsaved() {
    if (this.channelGroupForm.dirty || this.changeMade) {
      this.confirmDialog.open({
        title: "Cancel editing",
        message: "You have unsaved changes, if you cancel they will be lost.",
        cancelText: "Keep editing",
        confirmText: "Cancel",
      });
      this.confirmDialog.confirmed().subscribe((confirm) => {
        if (confirm) {
          this.cancel();
        }
      });
    } else {
      this.cancel();
    }
  }

  // Give a warning to user that delete will also delete widgets
  onDelete() {
    this.confirmDialog.open({
      title: `Delete ${
        this.editMode ? this.channelGroup.name : "Channel Group"
      }`,
      message: "Are you sure? This action is permanent.",
      cancelText: "Cancel",
      confirmText: "Delete",
    });
    this.confirmDialog.confirmed().subscribe((confirm) => {
      if (confirm) {
        this.delete();
      }
    });
  }

  // Filter searched channels using the map bounds
  filterBounds() {
    this.availableChannels = this.searchChannels.filter((channel) => {
      const latCheck =
        channel.lat <= this.bounds.lat_max &&
        channel.lat >= this.bounds.lat_min;
      const lonCheck =
        channel.lon >= this.bounds.lon_min &&
        channel.lon <= this.bounds.lon_max;
      return latCheck && lonCheck;
    });
  }

  // Update bounds for filtering channels with map
  updateBounds(newBounds: string) {
    console.log(newBounds);
    if (!newBounds) {
      this.rows = [...this.channelsInGroup];
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
      if (this.availableChannels.length === 0) {
        this.getChannelsWithFilters(this.bounds); // Uncomment to make api request for channels in lat lon
      } else {
        this.filterBounds();
      }
    }
  }
}
