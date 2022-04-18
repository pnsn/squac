import { Injectable } from "@angular/core";
import { SquacApiService } from "@core/services/squacapi.service";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { Trigger, TriggerAdapter } from "../models/trigger";

@Injectable({
  providedIn: "root",
})
export class TriggersService {
  private url = "measurement/triggers/";

  constructor(
    private squacApi: SquacApiService,
    private triggerAdapter: TriggerAdapter
  ) {}

  getTriggers(): Observable<Trigger[]> {
    return this.squacApi
      .get(this.url)
      .pipe(
        map((results) =>
          results.map((r) => this.triggerAdapter.adaptFromApi(r))
        )
      );
  }

  updateTriggers(
    triggers: Trigger[],
    deleteTriggers: number[],
    monitorId: number
  ): Observable<Trigger>[] {
    const triggerSubs = [];
    for (const trigger of triggers) {
      triggerSubs.push(this.updateTrigger(trigger, monitorId));
    }
    for (const id of deleteTriggers) {
      triggerSubs.push(this.deleteTrigger(id));
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

  deleteTrigger(id): Observable<any> {
    return this.squacApi.delete(this.url, id);
  }
}
