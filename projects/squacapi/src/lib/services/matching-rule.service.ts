import { Injectable } from "@angular/core";
import { SquacApiService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import {
  ApiService,
  NslcMatchingRulesDeleteRequestParams,
  NslcMatchingRulesListRequestParams,
  NslcMatchingRulesReadRequestParams,
  NslcMatchingRulesUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { MatchingRule, MatchingRuleAdapter } from "../../../models";
import { ApiEndpoint } from "../enums";

/**
 * Service for requesting matching rules from squacapi
 */
@Injectable({
  providedIn: "root",
})
export class MatchingRuleService
  extends BaseApiService<MatchingRule>
  implements SquacApiService<MatchingRule>
{
  constructor(override api: ApiService, override adapter: MatchingRuleAdapter) {
    super(ApiEndpoint.MATCHING_RULE, api);
  }

  /** @override */
  override readParams(id: number): NslcMatchingRulesReadRequestParams {
    return { id };
  }

  /** @override */
  override deleteParams(id: number): NslcMatchingRulesDeleteRequestParams {
    return { id };
  }

  /** @override */
  override updateParams(m: MatchingRule): NslcMatchingRulesUpdateRequestParams {
    return {
      id: m.id,
      data: this.adapter.adaptToApi(m),
    };
  }

  /** @override */
  override read(id: number, refresh?: boolean): Observable<MatchingRule> {
    return super.read(id, refresh);
  }

  /** @override */
  list(
    params: NslcMatchingRulesListRequestParams,
    refresh?: boolean
  ): Observable<MatchingRule[]> {
    return super._list(params, { refresh });
  }

  /** @override */
  updateOrCreate(t: MatchingRule): Observable<MatchingRule> {
    return super._updateOrCreate(t);
  }

  /** @override */
  override delete(id: number): Observable<MatchingRule> {
    return super.delete(id);
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
