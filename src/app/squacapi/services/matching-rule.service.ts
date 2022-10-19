import { Injectable } from "@angular/core";
import {
  BaseApiService,
  SquacApiService,
} from "../interfaces/generic-api-service";
import {
  ApiService,
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
export class MatchingRuleService
  extends BaseApiService<MatchingRule>
  implements SquacApiService<MatchingRule>
{
  constructor(
    protected api: ApiService,
    protected adapter: MatchingRuleAdapter
  ) {
    super("nslcMatchingRules", api);
  }

  // matching rules is weird and uses number ids unlike other endpoints
  readParams(id: number): NslcMatchingRulesReadRequestParams {
    return { id };
  }

  deleteParams(id: number): NslcMatchingRulesDeleteRequestParams {
    console.log("get widget id");
    return { id };
  }

  updateParams(m: MatchingRule): NslcMatchingRulesUpdateRequestParams {
    console.log("widget create params");
    return {
      id: m.id,
      data: this.adapter.adaptToApi(m),
    };
  }

  read(id: number): Observable<MatchingRule> {
    return super.read(id);
  }

  list(params: NslcMatchingRulesListRequestParams): Observable<MatchingRule[]> {
    return super._list(params);
  }

  updateOrCreate(t: MatchingRule): Observable<MatchingRule> {
    return super._updateOrCreate(t);
  }

  delete(id: number): Observable<MatchingRule> {
    return super.delete(id);
  }

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
