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
  @Input() channelGroupId: number | string | undefined;
  @Input() label = "Channel Group";
  @Input() required = false;
  @Input() appearance: MatFormFieldAppearance = "standard";
  @Input() dense = false;
  channelGroups: ChannelGroup[] | undefined;
  @Output() channelGroupIdChange = new EventEmitter<any>();
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
      .getSortedChannelGroups()
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
