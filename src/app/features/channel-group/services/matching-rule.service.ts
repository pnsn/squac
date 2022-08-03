import { Injectable } from "@angular/core";
import { SquacApiService } from "@core/services/squacapi.service";
import { Observable, map, tap } from "rxjs";
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

  // Replaces channel group with new channel group
  updateChannelGroup(matchingRule: MatchingRule) {
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
}
