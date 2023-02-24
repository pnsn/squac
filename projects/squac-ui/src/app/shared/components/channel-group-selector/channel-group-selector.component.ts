import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { ChannelGroup } from "squacapi";
import { ChannelGroupService } from "squacapi";
import { MatFormFieldAppearance } from "@angular/material/form-field";

interface Group {
  name: string;
  value: string;
  groups: ChannelGroup[];
}
/**
 * Shared selector for channel group
 */
@Component({
  selector: "shared-channel-group-selector",
  templateUrl: "./channel-group-selector.component.html",
  styleUrls: ["./channel-group-selector.component.scss"],
})
export class ChannelGroupSelectorComponent implements OnInit {
  /** channel group id */
  @Input() channelGroupId: number | string | undefined;
  /** label text */
  @Input() label = "Channel Group";
  /** true if field required */
  @Input() required = false;
  /** form appearance */
  @Input() appearance: MatFormFieldAppearance = "standard";
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

  displayFn(group: ChannelGroup): string {
    return group && group.name ? `${group.name} (${group.channelsCount})` : "";
  }
}
