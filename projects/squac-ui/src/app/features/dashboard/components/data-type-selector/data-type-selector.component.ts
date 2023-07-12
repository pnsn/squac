import { NgClass, NgForOf, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { ARCHIVE_STAT_OPTIONS, ARCHIVE_TYPE_OPTIONS } from "squacapi";
import { ArchiveStatType, ArchiveType } from "squacapi";
import { DataTypePipe } from "./data-type.pipe";

/**
 * Component for selecting archive type
 */
@Component({
  selector: "dashboard-data-type-selector",
  templateUrl: "./data-type-selector.component.html",
  styleUrls: ["./data-type-selector.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    NgIf,
    NgClass,
    NgForOf,
    DataTypePipe,
  ],
})
export class DataTypeSelectorComponent implements OnChanges {
  /** dataType to select */
  @Input() dataType: ArchiveType;
  /** Stat type to select */
  @Input() statType: ArchiveStatType;
  /** emits selected data types */
  @Output() dataTypeSelected = new EventEmitter<any>();

  /** stat types */
  StatTypes = ArchiveStatType;
  /** archive types */
  ArchiveType = ArchiveType;
  /** Archive type options */
  archiveTypeOptions = ARCHIVE_TYPE_OPTIONS;
  /** stat type options */
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
}
