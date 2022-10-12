import { Injectable } from "@angular/core";
import { ReadWriteDeleteApiService } from "@core/models/generic-api-service";
import { Trigger, TriggerAdapter } from "@monitor/models/trigger";
import {
  ApiService,
  MeasurementTriggersCreateRequestParams,
  MeasurementTriggersDeleteRequestParams,
  MeasurementTriggersListRequestParams,
  MeasurementTriggersReadRequestParams,
  MeasurementTriggersUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TriggerService extends ReadWriteDeleteApiService<Trigger> {
  constructor(triggerAdapter: TriggerAdapter, private api: ApiService) {
    super(triggerAdapter);
  }
  protected apiList = (params: MeasurementTriggersListRequestParams) =>
    this.api.measurementTriggersList(params);

  protected apiRead = (params: MeasurementTriggersReadRequestParams) =>
    this.api.measurementTriggersRead(params);

  protected apiCreate = (params: MeasurementTriggersCreateRequestParams) =>
    this.api.measurementTriggersCreate(params);

  protected apiUpdate = (params: MeasurementTriggersUpdateRequestParams) =>
    this.api.measurementTriggersUpdate(params);

  protected apiDelete = (params: MeasurementTriggersDeleteRequestParams) =>
    this.api.measurementTriggersDelete(params);

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
