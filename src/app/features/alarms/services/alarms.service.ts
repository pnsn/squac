import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';

@Injectable({
  providedIn: 'root'
})
export class AlarmsService {

  private url = 'alarms/metrics/';


  constructor(
    private squacApi: SquacApiService
  ) {}


  //getAlarms

  //getAlarm

}
