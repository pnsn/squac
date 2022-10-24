import { Injectable } from "@angular/core";
import { SquacApiService } from "../interfaces/api-service.interface";
import { BaseApiService } from "./generic-api.service";
import { Trigger, TriggerAdapter } from "../models/trigger";
import {
  ApiService,
  MeasurementTriggersListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoints } from "@squacapi/interfaces/api.interface";

@Injectable({
  providedIn: "root",
})
export class TriggerService
  extends BaseApiService<Trigger>
  implements SquacApiService<Trigger>
{
  constructor(protected adapter: TriggerAdapter, protected api: ApiService) {
    super(ApiEndpoints.TRIGGER, api);
  }

  read(id: number): Observable<Trigger> {
    return super.read(id);
  }

  list(params?: MeasurementTriggersListRequestParams): Observable<Trigger[]> {
    return super._list(params);
  }

  updateOrCreate(t: Trigger): Observable<Trigger> {
    return super._updateOrCreate(t);
  }

  delete(id: number): Observable<any> {
    return super.delete(id);
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
