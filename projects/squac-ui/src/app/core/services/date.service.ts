import { Injectable } from "@angular/core";
import * as dayjs from "dayjs";
import { Dayjs } from "dayjs";
import * as duration from "dayjs/plugin/duration";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import { DEFAULT_LOCALE, Locale } from "@core/locale.constant";

//service to help reduce imports of dayjs
/**
 *
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

  // adjust date using utc offset
  /**
   *
   * @param localDate
   */
  fakeUtcFromLocal(localDate: Dayjs): Dayjs {
    return localDate.add(localDate.utcOffset(), "minutes").utc();
  }

  // adjust date using utc offset
  /**
   *
   * @param localDate
   */
  fakeLocalFromUtc(localDate: Dayjs): Dayjs {
    return localDate.subtract(localDate.utcOffset(), "minutes").utc();
  }

  // change dayjs object to utc mode
  /**
   *
   * @param localDate
   */
  toUtc(localDate: Dayjs): Dayjs {
    return localDate.utc();
  }

  // Get milliseconds of utc date
  /**
   *
   * @param dateString
   */
  utcStringToMilliseconds(dateString: string): number {
    return this.parseUtc(dateString).valueOf() / 1000;
  }

  // get current time
  /**
   *
   */
  now(): Dayjs {
    return dayjs.utc().clone();
  }

  // subtract time from start
  /**
   *
   * @param start
   * @param amount
   * @param unit
   */
  subtract(start: Dayjs, amount: number, unit: string): Dayjs {
    const manipulateType = unit as dayjs.ManipulateType;
    return start.utc().subtract(amount, manipulateType);
  }

  // subtract time from now
  /**
   *
   * @param amount
   * @param unit
   */
  subtractFromNow(amount: number, unit: string): Dayjs {
    const manipulateType = unit as dayjs.ManipulateType;
    return this.now().subtract(amount, manipulateType);
  }

  //subtract duration
  /**
   *
   * @param start
   * @param duration
   */
  subtractDuration(start: Dayjs, duration: any): Dayjs {
    return start.utc().subtract(duration).clone();
  }

  // parse date from string
  /**
   *
   * @param date
   */
  parse(date: string): Dayjs {
    return dayjs(date).clone();
  }

  // parse utc date from string
  /**
   *
   * @param date
   */
  parseUtc(date: string): Dayjs {
    return dayjs.utc(date).clone();
  }

  // format date
  /**
   *
   * @param date
   */
  format(date: Dayjs): string {
    return date.utc().format(this.locale.format);
  }

  //format date but prettier
  /**
   *
   * @param date
   */
  displayFormat(date: Dayjs): string {
    return date.utc().format(this.locale.displayFormat);
  }

  // return difference in 'unit' between two dates
  /**
   *
   * @param date1
   * @param date2
   * @param unit
   */
  diff(date1: Dayjs, date2: Dayjs, unit?: any): number {
    return date1.diff(date2, unit || "seconds");
  }

  // return duration
  /**
   *
   * @param count
   * @param type
   */
  duration(count: number, type: string): duration.Duration {
    return dayjs.duration(count, type as duration.DurationUnitType);
  }
}
