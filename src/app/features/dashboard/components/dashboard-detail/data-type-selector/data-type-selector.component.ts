import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  ArchiveStatTypes,
  ArchiveTypes,
  ARCHIVE_TYPE_OPTIONS,
} from "@squacapi/interfaces/archivetypes";

@Component({
  selector: "dashboard-data-type-selector",
  templateUrl: "./data-type-selector.component.html",
  styleUrls: ["./data-type-selector.component.scss"],
})
export class DataTypeSelectorComponent implements OnChanges {
  @Input() dataType: ArchiveTypes;
  @Input() statType: ArchiveStatTypes;
  @Output() dataTypeSelected = new EventEmitter<any>();

  StatTypes = ArchiveStatTypes;

  DataTypes = ArchiveTypes;
  archiveTypeOptions = ARCHIVE_TYPE_OPTIONS;

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.statType || changes.dataType) {
      if (this.dataType === ArchiveTypes.RAW) {
        this.statType = null;
      }
    }
  }

  selectDataType(type: ArchiveTypes, stat: ArchiveStatTypes): void {
    this.statType = stat;
    this.dataType = type;

    this.dataTypeSelected.emit({
      statType: this.statType,
      dataType: this.dataType,
    });
  }

  get displayString() {
    let string = "";
    if (this.dataType) {
      const full = this.archiveTypeOptions[this.dataType].full;
      string += full;
    }
    if (this.statType) {
      string += ` ${this.statType}`;
    }
    return string;
  }
}
