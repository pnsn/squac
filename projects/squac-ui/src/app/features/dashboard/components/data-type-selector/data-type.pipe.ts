import { Pipe, PipeTransform } from "@angular/core";
import {
  ArchiveStatType,
  ArchiveType,
  ARCHIVE_STAT_OPTIONS,
  ARCHIVE_TYPE_OPTIONS,
} from "squacapi";
/**
 * Formats data type for display
 * Usage:
 *   dataType | dataType:statType
 */
@Pipe({ name: "dataType", standalone: true })
export class DataTypePipe implements PipeTransform {
  archiveTypeOptions = ARCHIVE_TYPE_OPTIONS;
  statTypeOptions = ARCHIVE_STAT_OPTIONS;

  /**
   * Transforms given dataType and statType into a display string
   *
   * @param dataType type of data
   * @param statType type of stat
   * @returns formatted string for display
   */
  transform(dataType: ArchiveType, statType: ArchiveStatType): string {
    let string = "";
    if (dataType) {
      const full = this.archiveTypeOptions[dataType].full;
      string += full;
    }
    if (statType && this.statTypeOptions[statType]) {
      string += `: ${this.statTypeOptions[statType]}`;
    }
    return string;
  }
}
