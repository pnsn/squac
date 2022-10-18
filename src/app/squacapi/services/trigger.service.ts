import { Injectable } from "@angular/core";
import {
  GenericApiService,
  SquacApiService,
} from "../interfaces/generic-api-service";
import { Trigger, TriggerAdapter } from "../models/trigger";
import {
  ApiService,
  MeasurementTriggersDeleteRequestParams,
  MeasurementTriggersListRequestParams,
  MeasurementTriggersReadRequestParams,
  MeasurementTriggersUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TriggerService extends SquacApiService<Trigger> {
  constructor(protected adapter: TriggerAdapter, protected api: ApiService) {
    super("measurementTriggers", api);
  }

  listParams(params: any): MeasurementTriggersListRequestParams {
    return params;
  }

  // combine observables for update or create triggers
  updateTriggers(
    triggers: Trigger[],
    deleteTriggers: number[],
    monitorId: number
  ): Observable<Trigger>[] {
    const triggerSubs = [];
    for (const trigger of triggers) {
      trigger.monitorId = monitorId;
      triggerSubs.push(this.updateOrCreate(trigger));
    }
    for (const id of deleteTriggers) {
      triggerSubs.push(this.delete(id));
    }
    return triggerSubs;
  }
}
