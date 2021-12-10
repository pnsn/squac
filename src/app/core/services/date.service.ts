import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs';
import * as duration from 'dayjs';
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

  now(): dayjs.Dayjs {
    return dayjs.utc().clone();
  }

  subtract(start: dayjs.Dayjs, amount:number, unit: string): dayjs.Dayjs {
    return start.utc().subtract(amount, unit);
  }

  subtractFromNow(amount: number, unit: string) : dayjs.Dayjs {
    return this.now().subtract(amount, unit);
  }

  subtractDuration(start: dayjs.Dayjs, duration): dayjs.Dayjs {
    return start.utc().subtract(duration).clone();
  }

  parseUtc(date: string) : dayjs.Dayjs {
    return dayjs.utc(date).clone();
  }

  format(date: dayjs.Dayjs): string {
    return date.format(this.locale.format);
  }

  displayFormat(date: dayjs.Dayjs): string {
    return date.format(this.locale.displayFormat);
  }

  //return in seconds
  diff(date1: dayjs.Dayjs, date2: dayjs.Dayjs) {
    return date1.diff(date2, 'seconds');
  }

  duration(count:number, type:string) {
    return dayjs.duration(count, type);
  }

  get dateRanges () {
    return this.configService.getValue('dateRanges');
  }

  get defaultTimeRange() {
    return this.configService.getValue('defaultTimeRange', 3);
  }

}
