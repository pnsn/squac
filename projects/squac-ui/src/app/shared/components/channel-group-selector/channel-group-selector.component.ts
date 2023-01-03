import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { ChannelGroup } from "squacapi";
import { ChannelGroupService } from "squacapi";
import { MatFormFieldAppearance } from "@angular/material/form-field";

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

  /** channel groups available for selection */
  groups: any;
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
      .getSortedChannelGroups({ order: "name" })
      .subscribe((sortedGroups) => {
        this.groups = sortedGroups;
      });
  }

  /**
   * Emit selected channel group id and update url with id
   */
  selectionChange(): void {
    this.channelGroupIdChange.emit(this.channelGroupId);

    const url = this.router
      .createUrlTree([], {
        relativeTo: this.route,
        queryParams: { group: this.channelGroupId },
      })
      .toString();

    this.location.go(url);
  }
}
