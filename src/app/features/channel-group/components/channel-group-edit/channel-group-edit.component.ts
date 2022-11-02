import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ChannelGroup } from "@squacapi/models/channel-group";
import { ChannelGroupService } from "@squacapi/services/channel-group.service";
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  UntypedFormBuilder,
} from "@angular/forms";
import { ChannelService } from "@squacapi/services/channel.service";
import { Channel } from "@squacapi/models/channel";
import {
  Subscription,
  switchMap,
  tap,
  map,
  merge,
  of,
  catchError,
  EMPTY,
} from "rxjs";
import {
  ColumnMode,
  SelectionType,
  SortType,
} from "@boring.devs/ngx-datatable";
import { UserService } from "@user/services/user.service";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MessageService } from "@core/services/message.service";
import { MatchingRuleService } from "@squacapi/services/matching-rule.service";
import { MatchingRule } from "@squacapi/models/matching-rule";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { MapBounds } from "../channel-group-map/channel-group-map.component";

enum LoadingIndicator {
  MAIN,
  RESULTS,
}
@Component({
  selector: "channel-group-edit",
  templateUrl: "./channel-group-edit.component.html",
  styleUrls: ["./channel-group-edit.component.scss"],
})
// TODO: this is getting massive - consider restructuring
export class ChannelGroupEditComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  LoadingIndicator = LoadingIndicator;
  id: number;
  channelGroup: ChannelGroup;
  editMode: boolean; //create group or edit group
  error: boolean | string = false;
  changeMade = false;
  orgId: number;
  showOnlyCurrent = true; // Filter out not-current channels
  searchFilters: any;
  channelGroupForm: UntypedFormGroup; // form stuff
  csvStatus: string;
  channelsInGroup: Channel[] = []; // channels currently saved in group
  selectedChannels: Channel[] = []; // Channels currently in selected list
  selectedInGroupChannels: Channel[] = []; // Channels selected from group table
  previousChannels: Channel[]; // Store last version of channels for undo

  // Map stuff
  showChannel: Channel; // Channel to show on map
  bounds: MapBounds; // Latlng bounds to either filter by or make a new request with

  // table config
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  SortType = SortType;
  columns: any = [];
  rows: Channel[] = [];
  deleteMatchingRulesIds = [];

  lastState: {
    selectedChannels: Channel[];
    autoIncludeChannels: Channel[];
    autoExcludeChannels: Channel[];
  };
  matchingRules: MatchingRule[];
  autoIncludeChannels: Channel[] = [];
  autoExcludeChannels: Channel[] = [];
  @ViewChild("availableTable") availableTable: any;
  @ViewChild("selectedTable") selectedTable: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private channelGroupService: ChannelGroupService,
    private channelService: ChannelService,
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private confirmDialog: ConfirmDialogService,
    private messageService: MessageService,
    private matchingRuleService: MatchingRuleService,
    private dateService: DateService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.channelGroupForm = this.formBuilder.group({
      name: new UntypedFormControl("", Validators.required),
      description: new UntypedFormControl("", Validators.required),
      share: ["private", Validators.required],
    });
    const chanSub = this.route.params
      .pipe(
        map((params) => {
          this.id = params.channelGroupId;
          this.editMode = !!params.channelGroupId;

          return this.id;
        }),
        switchMap((groupId: number) => {
          if (!groupId) {
            return of();
          }
          return this.loadingService.doLoading(
            this.channelGroupService.read(groupId).pipe(
              tap((channelGroup: ChannelGroup) => {
                this.channelGroup = channelGroup;
              }),
              switchMap((channelGroup: ChannelGroup) => {
                this.channelGroup = channelGroup;
                if (!channelGroup) {
                  return of([]);
                }
                return this.matchingRuleService.list({
                  group: `${this.channelGroup.id}`,
                });
              }),
              tap((rules: MatchingRule[]) => {
                this.matchingRules = rules;
                this.initForm();
              }),
              catchError((error) => {
                this.error = error;
                return EMPTY;
              })
            )
          );
        })
      )
      .subscribe();
    // get orgId
    this.orgId = this.userService.userOrg;
    this.subscriptions.add(chanSub);

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
        prop: "net",
        draggable: false,
        sortable: true,
        resizeable: false,
        flexGrow: 1,
      },
      {
        name: "Station",
        prop: "net",
        draggable: false,
        sortable: true,
        resizeable: false,
        flexGrow: 1,
      },
      {
        name: "Location",
        prop: "loc",
        draggable: false,
        sortable: true,
        resizeable: false,
        flexGrow: 1,
      },
      {
        name: "Channel",
        prop: "code",
        draggable: false,
        sortable: true,
        resizeable: false,
        flexGrow: 1,
      },
    ];
  }

  // Inits group edit form
  private initForm(): void {
    // if editing existing group, populate with the info
    if (this.editMode) {
      let share = "private";
      if (this.channelGroup.shareAll) {
        share = "shareAll";
      } else if (this.channelGroup.shareOrg) {
        share = "shareOrg";
      }
      this.channelGroupForm.patchValue({
        name: this.channelGroup.name,
        description: this.channelGroup.description,
        share,
      });
      this.autoExcludeChannels = [...this.channelGroup.autoExcludeChannels];
      this.autoIncludeChannels = [...this.channelGroup.autoIncludeChannels];
    }
  }

  includeChannels() {
    this.updateState();

    //get all channels that aren't already in add channels
    const addChannels = this.findChannelsInGroup(this.autoIncludeChannels);

    // add channels
    this.autoExcludeChannels = this.autoExcludeChannels.filter((channel) => {
      const index = addChannels.findIndex((c) => c.id === channel.id);
      return index === -1;
    });

    this.autoIncludeChannels = [...this.autoIncludeChannels, ...addChannels];
    //remove from excluded
    this.selectedChannels = [];
  }

  excludeChannels() {
    this.updateState();
    const addChannels = this.findChannelsInGroup(this.autoExcludeChannels);

    this.autoIncludeChannels = this.autoIncludeChannels.filter((channel) => {
      const index = addChannels.findIndex((c) => c.id === channel.id);
      return index === -1;
    });

    this.autoExcludeChannels = [...this.autoExcludeChannels, ...addChannels];
    //remove from included
    this.selectedChannels = [];
  }

  // returns channels that are not already in groupChannels
  private findChannelsInGroup(group): Channel[] {
    return this.selectedChannels.filter((channel) => {
      const index = group.findIndex((c) => c.id === channel.id);
      return index === -1;
    });
  }

  // restore channels to last cversion
  undoSelectRemove(): void {
    this.autoExcludeChannels = this.lastState.autoExcludeChannels;
    this.autoIncludeChannels = this.lastState.autoIncludeChannels;
    this.selectedChannels = this.lastState.selectedChannels;

    this.updateState();
    this.changeMade = false;
  }

  updateState() {
    this.changeMade = true;

    this.lastState = {
      autoIncludeChannels: [...this.autoIncludeChannels],
      autoExcludeChannels: [...this.autoExcludeChannels],
      selectedChannels: [...this.selectedChannels],
    };
  }

  addChannelsFromCSV(channels) {
    this.rows = [...channels];
    this.selectedChannels = [...channels];
  }

  // row selected on table
  selectRow(selectedChannels: Channel[]): void {
    this.showChannel = selectedChannels[selectedChannels.length - 1];
    this.selectedChannels = [...selectedChannels];
  }

  // filters changed in filter componenet
  filtersChanged(searchFilters: any): void {
    //clear all filters
    this.searchFilters = searchFilters;

    //clear bounds if search filters emptied
    if (Object.keys(searchFilters).length === 0) {
      this.bounds = null;
    }

    this.getChannelsWithFilters();
  }

  previewRules(rules: MatchingRule[]) {
    this.error = false;
    const params: any = {};
    if (this.showOnlyCurrent) {
      const now = this.dateService.now();
      params.endafter = this.dateService.format(now);
    }
    if (rules && rules.length > 0) {
      const ruleSubs = this.channelService.getChannelsByRules(rules, params);
      const results = [];
      this.loadingService
        .doLoading(merge(...ruleSubs), this, LoadingIndicator.RESULTS)
        .pipe(
          tap((channels: Channel[]) => {
            channels.forEach((channel) => {
              const index = results.findIndex((chan) => chan.id === channel.id);
              const excluded = this.checkRules(channel, rules);
              if (index < 0 && !excluded && channel) {
                results.push(channel);
              }
            });
          })
        )
        .subscribe({
          next: () => {
            this.selectedChannels = [...results];
            this.rows = [...results];
            // add channels to selected Channels
          },
        });
    }
  }

  //return true if channel should be excluded
  private checkRules(channel, rules) {
    //excluded if any of them are true
    const excludeRules = rules.filter((rule) => rule.isInclude !== true);

    if (excludeRules.length === 0) {
      return false;
    }

    return excludeRules.every((rule: MatchingRule) => {
      let net = false;
      let sta = false;
      let loc = false;
      let chan = false;
      if (rule.networkRegex) {
        net = new RegExp(rule.networkRegex, "i").test(channel.net);
      }
      if (rule.stationRegex) {
        sta = new RegExp(rule.stationRegex, "i").test(channel.sta);
      }
      if (rule.locationRegex) {
        loc = new RegExp(rule.locationRegex, "i").test(channel.loc);
      }
      if (rule.channelRegex) {
        chan = new RegExp(rule.channelRegex, "i").test(channel.code);
      }

      return net || sta || loc || chan;
    });
  }

  // get channels with filters and/or bounds
  getChannelsWithFilters(): void {
    const searchFilters = { ...this.bounds, ...this.searchFilters };
    if (Object.keys(searchFilters).length !== 0) {
      if (this.showOnlyCurrent) {
        const now = this.dateService.now();
        searchFilters.endafter = this.dateService.format(now);
      }
      console.log(searchFilters);
      this.error = false;
      this.loadingService
        .doLoading(
          this.channelService.list(searchFilters),
          this,
          LoadingIndicator.RESULTS
        )
        .subscribe({
          next: (response) => {
            this.selectedChannels = [...response];
            this.rows = [...response];
            //select retunred rows that are in group
          },
        });
    } else {
      this.selectedChannels = [];
      this.rows = [];
    }
  }

  // Save channel information
  save(): void {
    const values = this.channelGroupForm.value;
    const shareAll = values.share === "shareAll";
    const shareOrg = values.share === "shareOrg" || shareAll;
    const cg = new ChannelGroup(
      this.id,
      null,
      values.name,
      values.description,
      this.orgId
    );

    //need to updatematching rules

    cg.autoExcludeChannels = this.autoExcludeChannels;
    cg.autoIncludeChannels = this.autoIncludeChannels;
    cg.shareAll = shareAll;
    cg.shareOrg = shareOrg;

    /*
      Temp fix for channel groups not updating with channels on
      save unless there's matching rules.
      Saves channels to group manually
    */
    if (this.matchingRules.length === 0) {
      cg.channels = [...cg.channels];
    }
    let id;
    this.loadingService
      .doLoading(
        this.channelGroupService.updateOrCreate(cg).pipe(
          switchMap((group) => {
            id = group.id;
            if (
              this.matchingRules.length === 0 &&
              this.deleteMatchingRulesIds.length === 0
            ) {
              return of([]);
            }
            return merge(
              ...this.matchingRuleService.updateMatchingRules(
                this.matchingRules,
                this.deleteMatchingRulesIds,
                id
              )
            );
          })
        ),
        this,
        LoadingIndicator.MAIN
      )
      .subscribe({
        next: () => {
          this.changeMade = false;
          this.cancel(id);
          this.messageService.message("Channel group saved.");
        },
        error: () => {
          this.messageService.error("Could not save channel group.");
        },
      });
  }

  // Delete channel group
  delete(): void {
    this.channelGroupService.delete(this.id).subscribe({
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

  // add user's searched params to the request
  addFilterToRegex(filter) {
    const newRule = new MatchingRule(null, null, this.id, true);
    newRule.networkRegex = filter.netSearch?.toUpperCase();
    newRule.stationRegex = filter.staSearch?.toUpperCase();
    newRule.locationRegex = filter.locSearch?.toUpperCase();
    newRule.channelRegex = filter.chanSearch?.toUpperCase();
    this.matchingRules = [...this.matchingRules, newRule];
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
        channel.lat <= this.bounds.latMax && channel.lat >= this.bounds.latMin;
      const lonCheck =
        channel.lon >= this.bounds.lonMin && channel.lon <= this.bounds.lonMax;
      return latCheck && lonCheck;
    });

    this.selectedChannels = temp;
  }

  deleteMatchingRules(ids: number[]) {
    this.deleteMatchingRulesIds = ids;
  }

  // Update bounds for filtering channels with map
  updateBounds(newBounds: MapBounds): void {
    this.bounds = newBounds;
    if (!this.bounds) {
      this.rows = [...this.selectedChannels];
    } else {
      this.getChannelsWithFilters();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
