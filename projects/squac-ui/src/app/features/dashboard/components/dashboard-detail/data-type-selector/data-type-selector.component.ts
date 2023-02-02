import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { ARCHIVE_STAT_OPTIONS, ARCHIVE_TYPE_OPTIONS } from "squacapi";
import { ArchiveStatType, ArchiveType } from "squacapi";

/**
 * Component for selecting archive type
 */
@Component({
  selector: "dashboard-data-type-selector",
  templateUrl: "./data-type-selector.component.html",
  styleUrls: ["./data-type-selector.component.scss"],
})
export class DataTypeSelectorComponent implements OnChanges {
  @Input() dataType: ArchiveType;
  @Input() statType: ArchiveStatType;
  @Output() dataTypeSelected = new EventEmitter<any>();

  StatTypes = ArchiveStatType;

  ArchiveType = ArchiveType;
  archiveTypeOptions = ARCHIVE_TYPE_OPTIONS;
  statTypeOptions = ARCHIVE_STAT_OPTIONS;

  /**
   * Listen to input changes
   *
   * @param changes stattype changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["dataType"] || changes["statType"]) {
      if (this.dataType === "raw") {
        this.statType = null;
      }
    }
  }

  /**
   * Emit new datatypes after selection
   *
   * @param type selected archive type
   * @param stat selected stat type
   */
  selectDataType(type: ArchiveType, stat: ArchiveStatType): void {
    this.statType = stat;
    this.dataType = type;

    this.dataTypeSelected.emit({
      statType: this.statType,
      dataType: this.dataType,
    });
  }

  /** @returns formatted string */
  get displayString(): string {
    let string = "";
    if (this.dataType) {
      const full = this.archiveTypeOptions[this.dataType].full;
      string += full;
    }
    if (this.statType && this.statTypeOptions[this.statType]) {
      string += `: ${this.statTypeOptions[this.statType]}`;
    }
    return string;
  }
}
