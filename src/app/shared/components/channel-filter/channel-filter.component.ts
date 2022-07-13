import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Channel } from "@core/models/channel";

@Component({
  selector: "shared-channel-filter",
  templateUrl: "./channel-filter.component.html",
  styleUrls: ["./channel-filter.component.scss"],
})
export class ChannelFilterComponent implements OnInit {
  searchString: string;
  iterateCount = 0;
  @Output() filterChanged = new EventEmitter<any[]>();
  @Input() channels: Channel[];

  constructor() {}

  ngOnInit(): void {

  }(): void {}
}
