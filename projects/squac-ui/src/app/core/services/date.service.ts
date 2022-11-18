import { Injectable } from "@angular/core";
import * as dayjs from "dayjs";
import { Dayjs } from "dayjs";
import * as duration from "dayjs/plugin/duration";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import { DEFAULT_LOCALE } from "@core/locale.constant";

//service to help reduce imports of dayjs
@Injectable({
  providedIn: "root",
})
export class DateService {
  // "format": "YYYY-MM-DDTHH:mm:ss[Z]"
  // "displayFormat": "YYYY/MM/DD HH:mm"
  // "direction": "ltr"

  locale = DEFAULT_LOCALE;

  constructor() {
    dayjs.extend(utc);
    dayjs.extend(duration);
    dayjs.extend(timezone);
    dayjs.tz.setDefault("Etc/UTC");
  }

  // adjust date using utc offset
  fakeUtcFromLocal(localDate: Dayjs): Dayjs {
    return localDate.add(localDate.utcOffset(), "minutes").utc();
  }

  // adjust date using utc offset
  fakeLocalFromUtc(localDate: Dayjs): Dayjs {
    return localDate.subtract(localDate.utcOffset(), "minutes").utc();
  }

  // change dayjs object to utc mode
  toUtc(localDate: Dayjs): Dayjs {
    return localDate.utc();
  }

  // Get milliseconds of utc date
  utcStringToMilliseconds(dateString: string): number {
    return this.parseUtc(dateString).valueOf() / 1000;
  }

  // get current time
  now(): Dayjs {
    return dayjs.utc().clone();
  }

  // subtract time from start
  subtract(start: Dayjs, amount: number, unit: string): Dayjs {
    const manipulateType = unit as dayjs.ManipulateType;
    return start.utc().subtract(amount, manipulateType);
  }

  // subtract time from now
  subtractFromNow(amount: number, unit: string): Dayjs {
    const manipulateType = unit as dayjs.ManipulateType;
    return this.now().subtract(amount, manipulateType);
  }

  //subtract duration
  subtractDuration(start: Dayjs, duration): Dayjs {
    return start.utc().subtract(duration).clone();
  }

  // parse date from string
  parse(date: string): Dayjs {
    return dayjs(date).clone();
  }

  // parse utc date from string
  parseUtc(date: string): Dayjs {
    return dayjs.utc(date).clone();
  }

  // format date
  format(date: Dayjs): string {
    return date.utc().format(this.locale.format);
  }

  //format date but prettier
  displayFormat(date: Dayjs): string {
    return date.utc().format(this.locale.displayFormat);
  }

  // return difference in 'unit' between two dates
  diff(date1: Dayjs, date2: Dayjs, unit?: any): number {
    return date1.diff(date2, unit || "seconds");
  }

  // return duration
  duration(count: number, type: string) {
    return dayjs.duration(count, type as duration.DurationUnitType);
  }
}
