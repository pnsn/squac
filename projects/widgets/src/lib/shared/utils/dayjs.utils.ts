import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

/** Import dayjs module & extend once for module */
dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(timezone);
dayjs.tz.setDefault("Etc/UTC");

/**
 * Parse date string and return utc dayjs object
 *
 * @param {string} date - string in date format
 * @returns {Dayjs} Dayjs date object from date
 */
export function parseUtc(date: string): Dayjs {
  return dayjs.utc(date).clone();
}

/**
 * Default locale settings to use for date formats
 */
export const DEFAULT_LOCALE = {
  format: "YYYY-MM-DDTHH:mm:ss[Z]",
  displayFormat: "YYYY/MM/DD HH:mm",
  direction: "ltr",
};

/**
 * Formats date object and returns formatted date string
 * format set with {@link DEFAULT_LOCALE}
 *
 * @param {Dayjs} date - Dayjs date
 * @returns {string} string formatted date
 */
export function format(date: Dayjs): string {
  return date.format(DEFAULT_LOCALE.format);
}
