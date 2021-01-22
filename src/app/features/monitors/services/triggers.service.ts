import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { map } from 'rxjs/operators';
import { Trigger } from '../models/trigger';

@Injectable({
  providedIn: 'root'
})
export class TriggersService {


  private url = 'measurement/alarm-thresholds/';


  constructor(
    private squacApi: SquacApiService
  ) {}
  
  getTriggers() {
    return this.squacApi.get(this.url).pipe(
      map(
        results => {
          const triggers: Trigger[] = [];

          results.forEach(trigger => {
            triggers.push(this.mapTrigger(trigger));
          });
          return triggers;
        }
      )
    );
  }
  
  getTrigger(id: number) {
    return this.squacApi.get(this.url, id).pipe(
      map(
        response => {
          return this.mapTrigger(response);
        }
      )
    )
  }

    // Replaces channel group with new channel group
    updateTrigger(trigger: Trigger) {
      const postData = {
        id: 1
      };

      if (trigger.id) {
        postData.id = trigger.id;
        return this.squacApi.put(this.url, trigger.id, postData).pipe(map(
          response => this.mapTrigger(response)
        ));
      }
      return this.squacApi.post(this.url, postData).pipe(map(
        response => this.mapTrigger(response)
      ));
    }

  mapTrigger(trigger) {

    return trigger;
  }
}
