import { Pipe, PipeTransform } from "@angular/core";

/**
 * Replaces characters in strings
 */
@Pipe({
  name: "replace",
})
export class ReplacePipe implements PipeTransform {
  /**
   * Replaces given string in value with replacement
   *
   * @param value search string
   * @param strToReplace string to replace
   * @param replacementStr replacement
   * @returns string with replacements
   * @example {{ header| replace : '_' : ' ' }}
   */
  transform(
    value: string,
    strToReplace: string,
    replacementStr: string
  ): string {
    if (!value || !strToReplace || !replacementStr) {
      return value;
    }

    return value.replace(new RegExp(strToReplace, "g"), replacementStr);
  }
}
