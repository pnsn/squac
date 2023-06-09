import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { ChannelGroup } from "squacapi";
import { ChannelGroupService } from "squacapi";
import { MatFormFieldAppearance } from "@angular/material/form-field";

/** Grouping of Channel Groups with a name and form value */
interface Group {
  /** name of group to show as label */
  name: string;
  /** value for form option */
  value: string;
  /** list of ChannelGroups to display */
  groups: ChannelGroup[];
}

/**
 * Dropdown select for channel groups
 */
@Component({
  selector: "shared-channel-group-selector",
  templateUrl: "./channel-group-selector.component.html",
  styleUrls: ["./channel-group-selector.component.scss"],
})
export class ChannelGroupSelectorComponent implements OnInit, OnChanges {
  /** channel group id */
  @Input() channelGroupId: number | string | undefined;
  /** label text */
  @Input() label = "Channel Group";
  /** true if field required */
  @Input() required = false;
  /** form appearance */
  @Input() appearance: MatFormFieldAppearance = "fill";
  /** true if use dense style */
  @Input() dense = false;
  /** channel groups available for select */
  channelGroups: ChannelGroup[] | undefined;
  /** selected channel group id */
  @Output() channelGroupIdChange = new EventEmitter<any>();
  /** currently selected channel group */
  selectedChannelGroup: ChannelGroup;
  /** channel groups grouped by property */
  sortedGroups: Group[] = [
    {
      name: "Private Groups",
      value: "private",
      groups: [],
    },
    {
      name: "Organization Groups",
      value: "org",
      groups: [],
    },
    {
      name: "Public Groups",
      value: "public",
      groups: [],
    },
  ];
  /*{
    name: string;
    groups: ChannelGroup[];
  };*/
  constructor(
    private channelGroupService: ChannelGroupService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  /**
   * Subscrive to channel groups
   */
  ngOnInit(): void {
    this.channelGroupService
      .list({ order: "name" })
      .subscribe((groups: ChannelGroup[]) => {
        this.channelGroups = groups;
        const publicGroups = this.sortedGroups.find(
          (group) => group.value === "public"
        );
        const orgGroups = this.sortedGroups.find(
          (group) => group.value === "org"
        );
        const privateGroups = this.sortedGroups.find(
          (group) => group.value === "private"
        );
        this.channelGroups.forEach((cg: ChannelGroup) => {
          if (
            !this.selectedChannelGroup &&
            this.channelGroupId &&
            cg.id === this.channelGroupId
          ) {
            this.selectedChannelGroup = cg;
          }
          if (cg.shareAll) {
            publicGroups?.groups.push(cg);
          } else if (cg.shareOrg) {
            orgGroups?.groups.push(cg);
          } else {
            privateGroups?.groups.push(cg);
          }
        });
      });
  }

  /**
   * @override
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["channelGroupId"] &&
      this.channelGroupId !== this.selectedChannelGroup?.id &&
      this.channelGroups
    ) {
      this.selectedChannelGroup = this.channelGroups.find(
        (cg) => cg.id === this.channelGroupId
      );
    }
  }

  /**
   * Emit selected channel group id and update url with id
   */
  selectionChange(): void {
    this.channelGroupId = this.selectedChannelGroup.id;
    this.channelGroupIdChange.emit(this.channelGroupId);

    const url = this.router
      .createUrlTree([], {
        relativeTo: this.route,
        queryParams: { group: this.channelGroupId },
      })
      .toString();

    this.location.go(url);
  }

  /**
   * Returns formatted string for displaying Chanel group
   *
   * @param group channel group
   * @returns string with channel group name and count
   */
  displayFn(group: ChannelGroup): string {
    return group && group.name ? `${group.name} (${group.channelsCount})` : "";
  }
}
