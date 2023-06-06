import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ChannelGroup } from "squacapi";
import { ChannelGroupService } from "squacapi";
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { ChannelService } from "squacapi";
import { Channel } from "squacapi";
import { Subscription, switchMap, tap, merge, of } from "rxjs";
import {
  ColumnMode,
  SelectionType,
  SortType,
} from "@boring.devs/ngx-datatable";
import { UserService } from "@user/services/user.service";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MessageService } from "@core/services/message.service";
import { MatchingRuleService } from "squacapi";
import { MatchingRule } from "squacapi";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { MapBounds } from "../channel-group-map/interfaces";
import { SearchFilter } from "./interfaces";
import {
  ButtonEvent,
  PageOptions,
} from "@shared/components/detail-page/detail-page.interface";
import { FilterText } from "@shared/components/sharing-toggle/sharing-toggle.interface";

/** Loading indicator areas */
enum LoadingIndicator {
  MAIN,
  RESULTS,
}

/** Channel group edit form */
interface ChannelGroupForm {
  /** channel group name */
  name: FormControl<string>;
  /** channel group description */
  description: FormControl<string>;
}
/**
 * Channel group editing component
 */
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
  searchFilters: SearchFilter;
  channelGroupForm: FormGroup<ChannelGroupForm>; // form stuff
  csvStatus: string;
  channelsInGroup: Channel[] = []; // channels currently saved in group
  selectedChannels: Channel[] = []; // Channels currently in selected list
  selectedInGroupChannels: Channel[] = []; // Channels selected from group table
  previousChannels: Channel[]; // Store last version of channels for undo

  shareOrg = false;
  shareAll = false;
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
  matchingRules: MatchingRule[] = [];
  autoIncludeChannels: Channel[] = [];
  autoExcludeChannels: Channel[] = [];
  @ViewChild("availableTable") availableTable: any;
  @ViewChild("selectedTable") selectedTable: any;

  /** Config for detail page */
  pageOptions: PageOptions = {
    titleButtons: {
      cancelButton: true,
      deleteButton: true,
    },
    path: "/channel-groups",
  };

  sharedToggleConfig: FilterText = {
    user: "Private",
    all: "Public",
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private channelGroupService: ChannelGroupService,
    private channelService: ChannelService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private confirmDialog: ConfirmDialogService,
    private messageService: MessageService,
    private matchingRuleService: MatchingRuleService,
    private dateService: DateService,
    public loadingService: LoadingService
  ) {}

  /**
   * Subscribe to route params
   */
  ngOnInit(): void {
    this.channelGroupForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
    });

    const routeSub = this.route.data
      .pipe(
        tap((data: any) => {
          this.channelGroup = data["channelGroup"];
          this.matchingRules = data["matchingRules"] || [];
          this.editMode = !!this.channelGroup;
          this.id = this.channelGroup?.id;
          this.pageOptions.titleButtons.deleteButton = this.editMode;
        })
      )
      .subscribe({
        next: () => {
          this.initForm();
        },
      });

    this.subscriptions.add(routeSub);

    // get orgId
    this.orgId = this.userService.userOrg;
  }

  /**
   * Inits group edit form
   */
  private initForm(): void {
    // if editing existing group, populate with the info
    if (this.editMode) {
      this.channelGroupForm.patchValue({
        name: this.channelGroup.name,
        description: this.channelGroup.description,
      });
      this.shareAll = this.channelGroup.shareAll;
      this.shareOrg = this.channelGroup.shareOrg;
      this.autoExcludeChannels = [
        ...this.channelGroup.autoExcludeChannels,
      ] as Channel[];
      this.autoIncludeChannels = [
        ...this.channelGroup.autoIncludeChannels,
      ] as Channel[];
    }
  }

  /**
   * Control clicked on header
   *
   * @param type type of button click
   */
  controlClicked(type: ButtonEvent): void {
    if (type === "delete") {
      this.delete();
    } else if (type === "cancel") {
      this.cancel();
    } else if (type === "save") {
      this.save();
    }
  }

  /**
   * Add auto included channels
   */
  includeChannels(): void {
    this.updateState();

    //get all channels that aren't already in add channels
    const addChannels = this.findChannelsInGroup(this.autoIncludeChannels);

    // remove channels from the autoExcludeChannels list
    this.autoExcludeChannels = this.autoExcludeChannels.filter((channel) => {
      const index = addChannels.findIndex((c) => c.id === channel.id);
      return index === -1;
    });

    this.autoIncludeChannels = [...this.autoIncludeChannels, ...addChannels];
    this.selectedChannels = [];
  }

  /**
   * add auto excluded channels
   */
  excludeChannels(): void {
    this.updateState();

    //find channels that need to be added
    const addChannels = this.findChannelsInGroup(this.autoExcludeChannels);

    //remove channels from the include
    this.autoIncludeChannels = this.autoIncludeChannels.filter((channel) => {
      const index = addChannels.findIndex((c) => c.id === channel.id);
      return index === -1;
    });

    this.autoExcludeChannels = [...this.autoExcludeChannels, ...addChannels];
    this.selectedChannels = [];
  }

  /**
   * Returns channels that are not already in the given group
   *
   * @param group group of channels
   * @returns all selected channels not in group
   */
  private findChannelsInGroup(group): Channel[] {
    return this.selectedChannels.filter((channel) => {
      const index = group.findIndex((c) => c.id === channel.id);
      return index === -1;
    });
  }

  /**
   * Undo changes by restoring last version
   */
  undoSelectRemove(): void {
    this.autoExcludeChannels = this.lastState.autoExcludeChannels;
    this.autoIncludeChannels = this.lastState.autoIncludeChannels;
    this.selectedChannels = this.lastState.selectedChannels;

    this.updateState();
    this.changeMade = false;
  }

  /**
   * Update last saved state of channels
   */
  updateState(): void {
    this.changeMade = true;

    this.lastState = {
      autoIncludeChannels: [...this.autoIncludeChannels],
      autoExcludeChannels: [...this.autoExcludeChannels],
      selectedChannels: [...this.selectedChannels],
    };
  }

  /**
   * Add channels to groups from csv
   *
   * @param channels new channels to add
   */
  addChannelsFromCSV(channels: Channel[]): void {
    this.rows = [...channels];
    this.selectedChannels = [...channels];
  }

  /**
   * Row selected on table
   *
   * @param selectedChannels all selected rows
   */
  selectRow(selectedChannels: Channel[]): void {
    this.showChannel = selectedChannels[selectedChannels.length - 1];
    this.selectedChannels = [...selectedChannels];
  }

  /**
   * Filters changed in the filter component
   *
   * @param searchFilters selected filters
   */
  filtersChanged(searchFilters: any): void {
    //clear all filters
    this.searchFilters = searchFilters;

    //clear bounds if search filters emptied
    if (Object.keys(searchFilters).length === 0) {
      this.bounds = null;
    }

    this.getChannelsWithFilters();
  }

  /**
   * Request channels using the matching rules
   *
   * @param rules matching rules to search with
   */
  previewRules(rules: MatchingRule[]): void {
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

  /**
   * Checks if channel should be included according to the given rules
   *
   * @param channel channel to check
   * @param rules rules to check
   * @returns true if channel should be excluded
   */
  private checkRules(channel: Channel, rules: MatchingRule[]): boolean {
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

  /**
   * Get channels with fitlers and/or bounds
   */
  getChannelsWithFilters(): void {
    const searchFilters = { ...this.bounds, ...this.searchFilters };
    if (Object.keys(searchFilters).length !== 0) {
      if (this.showOnlyCurrent) {
        const now = this.dateService.now();
        searchFilters.endafter = this.dateService.format(now);
      }
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

  /**
   * Saves channel group information
   */
  save(): void {
    const values = this.channelGroupForm.value;
    const cg = new ChannelGroup({
      id: this.id,
      name: values.name,
      description: values.description,
      organization: this.orgId,
      autoExcludeChannels: this.autoExcludeChannels,
      autoIncludeChannels: this.autoIncludeChannels,
      shareAll: this.shareAll,
      shareOrg: this.shareOrg,
    });

    /*
      Temp fix for channel groups not updating with channels on
      save unless there's matching rules.
      Saves channels to group manually
    */
    if (this.matchingRules.length === 0) {
      cg.channels = [...cg.autoIncludeChannels];
    }
    let id;
    this.loadingService
      .doLoading(
        this.channelGroupService.updateOrCreate(cg).pipe(
          switchMap((groupId: number) => {
            id = groupId;
            if (
              this.matchingRules.length === 0 &&
              this.deleteMatchingRulesIds.length === 0
            ) {
              return of([]);
            }
            this.matchingRules.forEach((m) => {
              m.channelGroupId = id;
            });
            return merge(
              ...this.matchingRuleService.updateOrDelete(
                this.matchingRules,
                this.deleteMatchingRulesIds
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

  /**
   * Deletes channel group
   */
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

  /**
   * Cancels and exits edit page
   *
   * @param id group id
   */
  cancel(id?: number): void {
    if (id && !this.id) {
      this.router.navigate(["../", id], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }

  /**
   * Checks if form has unsaved fields to prevent accidental navigation
   */
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

  /**
   * Adds users searched params to the channel request
   *
   * @param filter search filter
   */
  addFilterToRegex(filter: SearchFilter): void {
    const newRule = new MatchingRule();
    newRule.channelGroupId = this.id;
    newRule.isInclude = true;
    newRule.networkRegex = filter.netSearch?.toUpperCase();
    newRule.stationRegex = filter.staSearch?.toUpperCase();
    newRule.locationRegex = filter.locSearch?.toUpperCase();
    newRule.channelRegex = filter.chanSearch?.toUpperCase();
    this.matchingRules = [...this.matchingRules, newRule];
  }

  /**
   * Delete channel group after confirming with user
   */
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

  /**
   * Filter searched channels using the map bounds
   */
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

  /**
   * Delete matching rules with given ids
   *
   * @param ids ids of rules to delete
   */
  deleteMatchingRules(ids: number[]): void {
    this.deleteMatchingRulesIds = ids;
  }

  /**
   * Update bounds for filtering channels with map
   *
   * @param newBounds new bounds from map
   */
  updateBounds(newBounds: MapBounds): void {
    this.bounds = newBounds;
    if (!this.bounds) {
      this.rows = [...this.selectedChannels];
    } else {
      this.getChannelsWithFilters();
    }
  }

  /**
   * unsubscribe
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
