import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "dashboard-data-type-selector",
  templateUrl: "./data-type-selector.component.html",
  styleUrls: ["./data-type-selector.component.scss"],
})
export class DataTypeSelectorComponent implements OnInit {
  @Input() dataType: string;
  @Input() statType: string;
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
  dataTypes: any = [
    { value: "raw", short: "raw", full: "raw data" },
    { value: "day", short: "daily", full: "day archive" },
    { value: "month", short: "monthly", full: "month archive" },
  ];

  fullType: any; //used for keeping track of name

  ngOnInit(): void {
    if (this.dataType === "raw") {
      this.statType = "";
    }
    this.fullType = this.dataTypes.find((dataType) => {
      return dataType.value === this.dataType;
    });

    if (!this.fullType) {
      this.dataType === "raw";
      this.statType = "";
      this.fullType = { value: "raw", short: "raw", full: "raw data" };
    }
  }

  selectDataType(type, stat) {
    this.dataType = type;
    this.statType = stat;
    this.fullType = type;
    this.dataType = type.value;
    this.dataTypeSelected.emit({
      statType: this.statType,
      dataType: this.dataType,
    });
  }

  get displayString() {
    return this.fullType.full + " " + this.statType;
  }
}
