import { Injectable } from "@angular/core";
import { SquacApiService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import { Trigger, TriggerAdapter } from "../models";
import {
  ApiService,
  MeasurementTriggersListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoint } from "../enums";

/**
 * Service for requesting triggers from squac
 */
@Injectable({
  providedIn: "root",
})
export class TriggerService
  extends BaseApiService<Trigger>
  implements SquacApiService<Trigger>
{
  constructor(override adapter: TriggerAdapter, override api: ApiService) {
    super(ApiEndpoint.TRIGGER, api);
  }

  /**
   * @override
   */
  override read(id: number, refresh?: boolean): Observable<Trigger> {
    return super.read(id, refresh);
  }

  /**
   * @override
   */
  list(
    params?: MeasurementTriggersListRequestParams,
    refresh?: boolean
  ): Observable<Trigger[]> {
    return super._list(params, { refresh });
  }

  /**
   * @override
   */
  updateOrCreate(t: Trigger): Observable<Trigger> {
    return super._updateOrCreate(t);
  }

  /**
   * @override
   */
  override delete(id: number): Observable<Trigger> {
    return super.delete(id);
  }

  /**
   * Combine observables for updating or deleting triggers
   *
   * @param triggers triggers to update
   * @param deleteTriggers array of ids of triggers to delete
   * @param monitorId trigger monitor id
   * @returns combined observables of results
   */
  updateTriggers(
    triggers: Trigger[],
    deleteTriggers: number[],
    monitorId: number
  ): Observable<Trigger>[] {
    const triggerSubs: Observable<Trigger>[] = [];
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
