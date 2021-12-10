import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as duration from 'dayjs/plugin/duration';
import { ConfigurationService } from './configuration.service';

//service to help reduce imports of dayjs 

@Injectable({
  providedIn: 'root'
})
export class DateService {
  // "format": "YYYY-MM-DDTHH:mm:ss[Z]"
  // "displayFormat": "YYYY/MM/DD HH:mm"
  // "direction": "ltr"

  locale;

  constructor(
    private configService: ConfigurationService,
  ) {
    dayjs.extend(utc);
    dayjs.extend(duration);
    this.locale = configService.getValue('locale');
  }

  // get now 
  now(): dayjs.Dayjs {
    return dayjs.utc().clone();
  }

  // subtract time from start
  subtract(start: dayjs.Dayjs, amount:number, unit: string): dayjs.Dayjs {
    return start.utc().subtract(amount, unit);
  }

  // subtract time from now
  subtractFromNow(amount: number, unit: string) : dayjs.Dayjs {
    return this.now().subtract(amount, unit);
  }

  //subtract duration
  subtractDuration(start: dayjs.Dayjs, duration): dayjs.Dayjs {
    return start.utc().subtract(duration).clone();
  }

  // parse utc date from string
  parseUtc(date: string) : dayjs.Dayjs {
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

  // return differnece in seconds between two dates
  diff(date1: dayjs.Dayjs, date2: dayjs.Dayjs) {
    return date1.diff(date2, 'seconds');
  }

  // return duration
  duration(count:number, type: string) {
    return dayjs.duration(count, type as duration.DurationUnitType);
  }

  get dateRanges () {
    return this.configService.getValue('dateRanges');
  }

  get defaultTimeRange() {
    return this.configService.getValue('defaultTimeRange', 3);
  }

}
