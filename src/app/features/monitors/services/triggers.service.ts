import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trigger, TriggerAdapter } from '../models/trigger';

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
    private squacApi: SquacApiService,
    private triggerAdapter: TriggerAdapter
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
    trigger.monitorId = monitorId;
    const postData = this.triggerAdapter.adaptToApi(trigger);

    if (trigger.id) {
      return this.squacApi.put(this.url, trigger.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }

  deleteTrigger(id): Observable<any>{
    return this.squacApi.delete(this.url, id);
  }
}
