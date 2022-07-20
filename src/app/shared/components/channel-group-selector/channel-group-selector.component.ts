import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ChannelGroup } from "@core/models/channel-group";
import { ChannelGroupService } from "@features/channel-group/services/channel-group.service";
import { take } from "rxjs";

@Component({
  selector: "shared-channel-group-selector",
  templateUrl: "./channel-group-selector.component.html",
  styleUrls: ["./channel-group-selector.component.scss"],
})
export class ChannelGroupSelectorComponent implements OnInit {
  @Input() channelGroupId: number | string;
  @Input() label = "Channel Group";
  @Input() required = false;
  @Input() appearance = "";
  @Input() dense = false;
  channelGroups: ChannelGroup[];
  @Output() channelGroupIdChange = new EventEmitter<any>();
  @Output() channelsChange = new EventEmitter<any>();
  constructor(private channelGroupService: ChannelGroupService) {}

  ngOnInit(): void {
    this.channelGroupService.getChannelGroups().subscribe((channelGroups) => {
      this.channelGroups = channelGroups;
    });
  }

  selectionChange() {
    this.channelGroupIdChange.emit(this.channelGroupId);

    this.channelGroupService
      .getChannelGroup(+this.channelGroupId)
      .pipe(take(1))
      .subscribe((channelGroup) => {
        this.channelsChange.emit(channelGroup.channels);
      });
  }
}
