import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as duration from 'dayjs/plugin/duration';
import { ConfigurationService } from './configuration.service';

//service to help reduce imports of dayjs 

@Injectable({
  providedIn: 'root'
})
export class MockDateService {
  // "format": "YYYY-MM-DDTHH:mm:ss[Z]"
  // "displayFormat": "YYYY/MM/DD HH:mm"
  // "direction": "ltr"

  locale;
  dateranges = {
    "900" : "last 15 minutes",
    "1800" : "last 30 minutes",
    "3600" : "last 1 hour",
    "43200" : "last 12 hours",
    "86400": "last 24 hours",
    "604800" : "last 7 days",
    "1209600" : "last 14 days",
    "2592000" : "last 30 days"
   };



  constructor(
  ) {
    dayjs.extend(utc);
    dayjs.extend(duration);
    this.locale = {
      "format": "YYYY-MM-DDTHH:mm:ss[Z]",
      "displayFormat": "YYYY/MM/DD HH:mm",
      "direction": "ltr"
    };
  }

  correctForLocal(localDate: dayjs.Dayjs) : dayjs.Dayjs{
    return localDate.add(localDate.utcOffset(), 'minutes').utc();
  }

  toUtc(localDate: dayjs.Dayjs) : dayjs.Dayjs {
    return localDate.utc();
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
    return this.dateranges;
  }

  get defaultTimeRange() {
    return 3;
  }

}
