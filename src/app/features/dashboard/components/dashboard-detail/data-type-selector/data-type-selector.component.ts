import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { EventManager } from "@angular/platform-browser";

@Component({
  selector: "dashboard-data-type-selector",
  templateUrl: "./data-type-selector.component.html",
  styleUrls: ["./data-type-selector.component.scss"],
})
export class DataTypeSelectorComponent implements OnInit {
  @Input() type: string;
  @Input() stat: string;
  @Output() dataTypeSelected = new EventEmitter<any>();
  statTypes: string[] = [
    "min",
    "max",
    "mean",
    "median",
    "stdev",
    "num_samps",
    "p05",
    "p10",
    "p90",
    "p95",
    "minabs",
    "maxabs",
  ];
  constructor() {}

  ngOnInit(): void {
    if (this.type === "raw") {
      this.stat = "";
    }
  }

  selectDataType(type, stat) {
    console.log(type, stat);
    if (this.type === "raw") {
      this.stat = "";
    } else if (!this.stat) {
      this.stat = "min";
    }

    // this.dataTypeSelected.emit({ stat: this.stat, type: this.type });
  }
}
