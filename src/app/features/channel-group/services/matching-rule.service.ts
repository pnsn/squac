import { Injectable } from "@angular/core";
import { SquacApiService } from "@core/services/squacapi.service";
import { Observable, map } from "rxjs";
import { MatchingRule, MatchingRuleAdapter } from "../models/matching-rule";

@Injectable({
  providedIn: "root",
})
export class MatchingRuleService {
  private url = "nslc/matching-rules/";
  constructor(
    private squacApi: SquacApiService,
    private matchingRuleAdapter: MatchingRuleAdapter
  ) {}

  getMatchingRules(groupId?: number): Observable<MatchingRule[]> {
    return this.squacApi
      .get(this.url, null, { group: groupId })
      .pipe(
        map((response) =>
          response.map((r) => this.matchingRuleAdapter.adaptFromApi(r))
        )
      );
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
      ruleSubs.push(this.updateMatchingRule(rule));
    }
    for (const id of deleteRules) {
      ruleSubs.push(this.deleteRule(id));
    }
    return ruleSubs;
  }

  // Replaces channel group with new channel group
  updateMatchingRule(matchingRule: MatchingRule) {
    const postData = this.matchingRuleAdapter.adaptToApi(matchingRule);
    if (matchingRule.id) {
      return this.squacApi
        .put(this.url, matchingRule.id, postData)
        .pipe(
          map((response) => this.matchingRuleAdapter.adaptFromApi(response))
        );
    }
    return this.squacApi
      .post(this.url, postData)
      .pipe(map((response) => this.matchingRuleAdapter.adaptFromApi(response)));
  }

  // delete trigger
  deleteRule(id): Observable<any> {
    return this.squacApi.delete(this.url, id);
  }
}
