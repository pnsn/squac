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

  /**
   * Create observables for update or create requests
   *
   * @param rules array of rules to update or create
   * @param deleteRules ids of rules to delete
   * @param groupId associated channel group id
   * @returns observable of requests
   */
  updateMatchingRules(
    rules: MatchingRule[],
    deleteRules: number[],
    groupId: number
  ): Observable<MatchingRule>[] {
    const ruleSubs: Observable<MatchingRule>[] = [];
    for (const rule of rules) {
      rule.channelGroupId = groupId;
      ruleSubs.push(this.updateOrCreate(rule));
    }
    for (const id of deleteRules) {
      ruleSubs.push(this.delete(id));
    }
    return ruleSubs;
  }
}

export interface MatchingRuleService extends SquacApiService<MatchingRule> {
  read(id: number, refresh?: boolean): Observable<MatchingRule>;
  list(
    params: NslcMatchingRulesListRequestParams,
    refresh?: boolean
  ): Observable<MatchingRule[]>;
  updateOrCreate(t: MatchingRule): Observable<MatchingRule>;
  delete(id: number): Observable<MatchingRule>;
}
