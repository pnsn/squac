import { Injectable } from "@angular/core";
import { SquacApiService } from "../interfaces";
import { BaseWriteableApiService } from "./generic-api.service";
import { Trigger } from "../models";
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
export class TriggerService extends BaseWriteableApiService<Trigger> {
  constructor(override api: ApiService) {
    super(ApiEndpoint.TRIGGER, api);
  }
}

export interface TriggerService extends SquacApiService<Trigger> {
  read(id: number, refresh?: boolean): Observable<Trigger>;
  list(
    params?: MeasurementTriggersListRequestParams,
    refresh?: boolean
  ): Observable<Trigger[]>;
  updateOrCreate(t: Trigger): Observable<number>;
  delete(id: number): Observable<any>;
  updateOrDelete(groups: Trigger[], ids: number[]): Observable<number>[];
}
