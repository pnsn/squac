import { Injectable } from "@angular/core";
import { SquacApiService } from "../interfaces";
import { BaseWriteableApiService } from "./generic-api.service";
import {
  ApiService,
  NslcMatchingRulesListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { MatchingRule } from "../models";
import { ApiEndpoint } from "../enums";

/**
 * Service for requesting matching rules from squacapi
 */
@Injectable({
  providedIn: "root",
})
export class MatchingRuleService extends BaseWriteableApiService<MatchingRule> {
  constructor(override api: ApiService) {
    super(ApiEndpoint.MATCHING_RULE, api);
  }
}

export interface MatchingRuleService extends SquacApiService<MatchingRule> {
  read(id: number, refresh?: boolean): Observable<MatchingRule>;
  list(
    params: NslcMatchingRulesListRequestParams,
    refresh?: boolean
  ): Observable<MatchingRule[]>;
  updateOrCreate(t: MatchingRule): Observable<number>;
  delete(id: number): Observable<any>;
  updateOrDelete(groups: MatchingRule[], ids: number[]): Observable<number>[];
}
