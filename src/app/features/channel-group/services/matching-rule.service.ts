import { Injectable } from "@angular/core";
import { GenericApiService } from "@core/models/generic-api-service";
import {
  ApiService,
  NslcMatchingRulesCreateRequestParams,
  NslcMatchingRulesDeleteRequestParams,
  NslcMatchingRulesListRequestParams,
  NslcMatchingRulesUpdateRequestParams,
  ReadOnlyMatchingRuleSerializer,
} from "@pnsn/ngx-squacapi-client";
import { Observable, map } from "rxjs";
import { MatchingRule, MatchingRuleAdapter } from "../models/matching-rule";

@Injectable({
  providedIn: "root",
})
export class MatchingRuleService implements GenericApiService<MatchingRule> {
  constructor(
    private api: ApiService,
    private matchingRuleAdapter: MatchingRuleAdapter
  ) {}

  list(params: NslcMatchingRulesListRequestParams): Observable<MatchingRule[]> {
    return this.api.nslcMatchingRulesList(params).pipe(
      map((response: ReadOnlyMatchingRuleSerializer[]) => {
        return response.map(this.matchingRuleAdapter.adaptFromApi);
      })
    );
  }

  create(matchingRule: MatchingRule): Observable<MatchingRule> {
    const params: NslcMatchingRulesCreateRequestParams = {
      data: this.matchingRuleAdapter.adaptToApi(matchingRule),
    };
    return this.api
      .nslcMatchingRulesCreate(params)
      .pipe(map(this.matchingRuleAdapter.adaptFromApi));
  }

  update(matchingRule: MatchingRule): Observable<MatchingRule> {
    const params: NslcMatchingRulesUpdateRequestParams = {
      id: `${matchingRule.id}`,
      data: this.matchingRuleAdapter.adaptToApi(matchingRule),
    };
    return this.api
      .nslcMatchingRulesUpdate(params)
      .pipe(map(this.matchingRuleAdapter.adaptFromApi));
  }

  delete(id: number): Observable<any> {
    const params: NslcMatchingRulesDeleteRequestParams = {
      id: `${id}`,
    };
    return this.api.nslcMatchingRulesDelete(params);
  }

  updateOrCreate(matchingRule: MatchingRule): Observable<MatchingRule> {
    if (matchingRule.id) {
      return this.update(matchingRule);
    }
    return this.create(matchingRule);
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
