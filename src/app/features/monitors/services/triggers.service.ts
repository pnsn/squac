import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trigger } from '../models/trigger';

interface TriggerHttpData {
  monitor: number;
  band_inclusive: boolean;
  maxval?: number;
  minval?: number;
  level: number;
}

@Injectable({
  providedIn: 'root'
})
export class TriggersService {
  private url = 'measurement/triggers/';


  constructor(
    private squacApi: SquacApiService
  ) {}
  
  updateTriggers(triggers: Trigger[], monitorId: number): Observable<Trigger>[] {
    const triggerSubs = [];
    for (const trigger of triggers) {
      if (trigger.id && trigger.max === null && trigger.min === null) {
        triggerSubs.push(this.deleteTrigger(trigger.id));
      } else if (trigger.max !== null || trigger.min !== null) {
        triggerSubs.push(this.updateTrigger(trigger, monitorId));
      }
    }
    return triggerSubs;
  }

  private updateTrigger(trigger: Trigger, monitorId) {
    const postData: TriggerHttpData = {
      monitor: monitorId,
      band_inclusive: trigger.bandInclusive,
      level: trigger.level
    };
    if (trigger.min !== null) {
      postData.minval = trigger.min;
    }
    if (trigger.max !== null) {
      postData.maxval = trigger.max;
    }

    if (trigger.id) {
      return this.squacApi.put(this.url, trigger.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }

  deleteTrigger(id) : Observable<any>{
    return this.squacApi.delete(this.url, id);
  }
}
