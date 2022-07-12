import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "shared-channel-group-selector",
  templateUrl: "./channel-group-selector.component.html",
  styleUrls: ["./channel-group-selector.component.scss"],
})
export class ChannelGroupSelectorComponent implements OnInit, OnChanges {
  @Input() channelGroupId: string;
  @Input() channelGroups: string;
  @Output() channelGroupIdChange = new EventEmitter<any>();

  ngOnInit(): void {}

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
  }
}
