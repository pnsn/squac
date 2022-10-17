import { Injectable } from "@angular/core";
import { ReadWriteDeleteApiService } from "@core/models/generic-api-service";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { MatchingRule, MatchingRuleAdapter } from "../models/matching-rule";

@Injectable({
  providedIn: "root",
})
export class MatchingRuleService extends ReadWriteDeleteApiService<MatchingRule> {
  constructor(
    protected api: ApiService,
    protected adapter: MatchingRuleAdapter
  ) {
    super("nslcMatchingRules", api);
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
