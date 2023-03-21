import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { ChannelGroup, MatchingRule, MatchingRuleService } from "squacapi";
import { Observable } from "rxjs";

/**
 * Resolves matching rules for a channel group
 */
@Injectable({
  providedIn: "root",
})
export class MatchingRuleResolver
  implements Resolve<Observable<MatchingRule[]>>
{
  constructor(private matchingRuleService: MatchingRuleService) {}

  /**
   * Resolve matching rules for a channel group
   *
   * @param route activated route
   * @returns observable of results
   */
  resolve(route: ActivatedRouteSnapshot): Observable<MatchingRule[]> {
    const id = route.paramMap.get("channelGroupId");
    return this.matchingRuleService.list({
      group: `${id}`,
    });
  }
}
