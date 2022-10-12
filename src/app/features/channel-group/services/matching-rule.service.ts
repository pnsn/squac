import { Injectable } from "@angular/core";
import { ReadWriteDeleteApiService } from "@core/models/generic-api-service";
import {
  ApiService,
  NslcMatchingRulesCreateRequestParams,
  NslcMatchingRulesDeleteRequestParams,
  NslcMatchingRulesListRequestParams,
  NslcMatchingRulesReadRequestParams,
  NslcMatchingRulesUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { MatchingRule, MatchingRuleAdapter } from "../models/matching-rule";

@Injectable({
  providedIn: "root",
})
export class MatchingRuleService extends ReadWriteDeleteApiService<MatchingRule> {
  constructor(
    private api: ApiService,
    matchingRuleAdapter: MatchingRuleAdapter
  ) {
    super(matchingRuleAdapter);
  }

  protected apiList = (params: NslcMatchingRulesListRequestParams) =>
    this.api.nslcMatchingRulesList(params);
  protected apiRead = (params: NslcMatchingRulesReadRequestParams) =>
    this.api.nslcMatchingRulesRead(params);
  protected apiCreate = (params: NslcMatchingRulesCreateRequestParams) =>
    this.api.nslcMatchingRulesCreate(params);
  protected apiUpdate = (params: NslcMatchingRulesUpdateRequestParams) =>
    this.api.nslcMatchingRulesUpdate(params);
  protected apiDelete = (params: NslcMatchingRulesDeleteRequestParams) =>
    this.api.nslcMatchingRulesDelete(params);

  // combine observables for update or create triggers
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
