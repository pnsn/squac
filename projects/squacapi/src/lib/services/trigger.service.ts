import { Injectable } from "@angular/core";
import { SquacApiService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import { Trigger, TriggerAdapter } from "../../../models";
import {
  ApiService,
  MeasurementTriggersListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoint } from "../enums";

/**
 *
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
   *
   * @param id
   * @param refresh
   */
  override read(id: number, refresh?: boolean): Observable<Trigger> {
    return super.read(id, refresh);
  }

  /**
   *
   * @param params
   * @param refresh
   */
  list(
    params?: MeasurementTriggersListRequestParams,
    refresh?: boolean
  ): Observable<Trigger[]> {
    return super._list(params, { refresh });
  }

  /**
   *
   * @param t
   */
  updateOrCreate(t: Trigger): Observable<Trigger> {
    return super._updateOrCreate(t);
  }

  /**
   *
   * @param id
   */
  override delete(id: number): Observable<Trigger> {
    return super.delete(id);
  }

  // combine observables for update or create triggers
  /**
   *
   * @param triggers
   * @param deleteTriggers
   * @param monitorId
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
