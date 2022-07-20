import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { ChannelGroup } from "@core/models/channel-group";
import { ChannelGroupService } from "@features/channel-group/services/channel-group.service";
import { take } from "rxjs";

@Component({
  selector: "shared-channel-group-selector",
  templateUrl: "./channel-group-selector.component.html",
  styleUrls: ["./channel-group-selector.component.scss"],
})
export class ChannelGroupSelectorComponent implements OnInit, OnChanges {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.channelGroups) {
      console.log(changes.channelGroups);
    }
    if (changes.channelGroupId) {
      console.log("channnel group Id ins selector", this.channelGroupId);
    }
  }

  selectionChange(event) {
    this.channelGroupIdChange.emit(this.channelGroupId);

    this.channelGroupService
      .getChannelGroup(+this.channelGroupId)
      .pipe(take(1))
      .subscribe((channelGroup) => {
        console.log(channelGroup.channels);
        console.log(channelGroup.channels.length);
        this.channelsChange.emit(channelGroup.channels);
      });
  }
}
