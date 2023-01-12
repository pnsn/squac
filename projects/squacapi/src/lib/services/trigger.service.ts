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
export class TriggerService extends BaseApiService<Trigger> {
  constructor(override adapter: TriggerAdapter, override api: ApiService) {
    super(ApiEndpoint.TRIGGER, api);
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

export interface TriggerService extends SquacApiService<Trigger> {
  read(id: number, refresh?: boolean): Observable<Trigger>;
  list(
    params?: MeasurementTriggersListRequestParams,
    refresh?: boolean
  ): Observable<Trigger[]>;
  updateOrCreate(t: Trigger): Observable<Trigger>;
  delete(id: number): Observable<Trigger>;
}
