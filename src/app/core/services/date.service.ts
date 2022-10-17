import { Injectable } from "@angular/core";
import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
import * as utc from "dayjs/plugin/utc";
import { ConfigurationService } from "./configuration.service";

//service to help reduce imports of dayjs
@Injectable({
  providedIn: "root",
})
export class DateService {
  // "format": "YYYY-MM-DDTHH:mm:ss[Z]"
  // "displayFormat": "YYYY/MM/DD HH:mm"
  // "direction": "ltr"

  locale;

  constructor(private configService: ConfigurationService) {
    dayjs.extend(utc);
    dayjs.extend(duration);
    this.locale = configService.getValue("locale");
  }

  // adjust date using utc offset
  correctForLocal(localDate: dayjs.Dayjs): dayjs.Dayjs {
    return localDate.add(localDate.utcOffset(), "minutes").utc();
  }

  // change dayjs object to utc mode
  toUtc(localDate: dayjs.Dayjs): dayjs.Dayjs {
    return localDate.utc();
  }

  // Get milliseconds of utc date
  utcStringToMilliseconds(dateString: string): number {
    return this.parseUtc(dateString).valueOf() / 1000;
  }

  // get current time
  now(): dayjs.Dayjs {
    return dayjs.utc().clone();
  }

  // subtract time from start
  subtract(start: dayjs.Dayjs, amount: number, unit: string): dayjs.Dayjs {
    const manipulateType = unit as dayjs.ManipulateType;
    return start.utc().subtract(amount, manipulateType);
  }

  // subtract time from now
  subtractFromNow(amount: number, unit: string): dayjs.Dayjs {
    const manipulateType = unit as dayjs.ManipulateType;
    return this.now().subtract(amount, manipulateType);
  }

  //subtract duration
  subtractDuration(start: dayjs.Dayjs, duration): dayjs.Dayjs {
    return start.utc().subtract(duration).clone();
  }

  // parse utc date from string
  parseUtc(date: string): dayjs.Dayjs {
    return dayjs.utc(date).clone();
  }

  // format date
  format(date: dayjs.Dayjs): string {
    return date.utc().format(this.locale.format);
  }

  //format date but prettier
  displayFormat(date: dayjs.Dayjs): string {
    return date.utc().format(this.locale.displayFormat);
  }

  // return difference in 'unit' between two dates
  diff(date1: dayjs.Dayjs, date2: dayjs.Dayjs, unit?: any): number {
    return date1.diff(date2, unit || "seconds");
  }

  // return duration
  duration(count: number, type: string) {
    return dayjs.duration(count, type as duration.DurationUnitType);
  }

  // get dateranges from config
  get dateRanges() {
    return this.configService.getValue("dateRanges");
  }

  // get time ranges for date picker
  get datePickerTimeRanges() {
    return this.configService.getValue("datePickerTimeRanges");
  }

  // get default dashboard time range
  get defaultTimeRange() {
    return this.configService.getValue("defaultTimeRange", 3);
  }
}
