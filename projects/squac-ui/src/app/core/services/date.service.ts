import { Injectable } from "@angular/core";
import * as dayjs from "dayjs";
import { Dayjs } from "dayjs";
import * as duration from "dayjs/plugin/duration";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import { DEFAULT_LOCALE, Locale } from "@core/locale.constant";

/**
 * Service for management of dates
 */
@Injectable({
  providedIn: "root",
})
export class DateService {
  // "format": "YYYY-MM-DDTHH:mm:ss[Z]"
  // "displayFormat": "YYYY/MM/DD HH:mm"
  // "direction": "ltr"

  locale: Locale = DEFAULT_LOCALE;

  constructor() {
    dayjs.extend(utc);
    dayjs.extend(duration);
    dayjs.extend(timezone);
    dayjs.tz.setDefault("Etc/UTC");
  }

  /**
   * Adjust date adding utc offset
   *
   * @param localDate date in local time to adjust to utc
   * @returns adjusted date
   */
  fakeUtcFromLocal(localDate: Dayjs): Dayjs {
    return localDate.add(localDate.utcOffset(), "minutes").utc();
  }

  /**
   * Adjust date by subtracting utc offset
   *
   * @param localDate local date
   * @returns adjusted date
   */
  fakeLocalFromUtc(localDate: Dayjs): Dayjs {
    return localDate.subtract(localDate.utcOffset(), "minutes").utc();
  }

  /**
   * Change dayjs object to utc mode
   *
   * @param localDate local date
   * @returns utc dayjs
   */
  toUtc(localDate: Dayjs): Dayjs {
    return localDate.utc();
  }

  // Get milliseconds of utc date
  /**
   * Get milliseconds of a utc date string
   *
   * @param dateString string date
   * @returns number of milliseconds for date
   */
  utcStringToMilliseconds(dateString: string): number {
    return this.parseUtc(dateString).valueOf() / 1000;
  }

  /**
   * Get current time
   *
   * @returns new Dayjs object
   */
  now(): Dayjs {
    return dayjs.utc().clone();
  }

  /**
   * Subtracts an amount of time from a start time
   *
   * @param start start time
   * @param amount amount of time to subtract
   * @param unit unit of time to subtract
   * @returns result of subtraction
   */
  subtract(start: Dayjs, amount: number, unit: string): Dayjs {
    const manipulateType = unit as dayjs.ManipulateType;
    return start.utc().subtract(amount, manipulateType);
  }

  /**
   * Subtract given amount of time from now
   *
   * @param amount amount of time
   * @param unit unit to use
   * @returns result
   */
  subtractFromNow(amount: number, unit: string): Dayjs {
    const manipulateType = unit as dayjs.ManipulateType;
    return this.now().subtract(amount, manipulateType);
  }

  /**
   * Subtracts a duration from a start date
   *
   * @param start start date
   * @param duration duration to subtract
   * @returns result
   */
  subtractDuration(start: Dayjs, duration: any): Dayjs {
    return start.utc().subtract(duration).clone();
  }

  /**
   * Parse date from string
   *
   * @param date string
   * @returns new date from String
   */
  parse(date: string): Dayjs {
    return dayjs(date).clone();
  }

  /**
   * Parse utc date from string
   *
   * @param date string to parse
   * @returns new date from string
   */
  parseUtc(date: string): Dayjs {
    return dayjs.utc(date).clone();
  }

  /**
   * Format date using default locale
   *
   * @param date date to format
   * @returns formatted date
   */
  format(date: Dayjs): string {
    return date.utc().format(this.locale.format);
  }

  /**
   * Format date using locale displayFormat
   *
   * @param date date to format
   * @returns formatted date
   */
  displayFormat(date: Dayjs): string {
    return date.utc().format(this.locale.displayFormat);
  }

  /**
   * Takes two dates and calculates difference in 'unit' amount of time between them
   *
   * @param date1 first date
   * @param date2 second date
   * @param unit unit to use
   * @returns result
   */
  diff(date1: Dayjs, date2: Dayjs, unit?: any): number {
    return date1.diff(date2, unit || "seconds");
  }

  /**
   * Returns a dayjs duration object
   *
   * @param count amount of duration
   * @param type type of duration
   * @returns duration
   */
  duration(count: number, type: string): duration.Duration {
    return dayjs.duration(count, type as duration.DurationUnitType);
  }
}
