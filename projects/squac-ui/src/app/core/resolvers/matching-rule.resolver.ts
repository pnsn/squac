import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { MatchingRule, MatchingRuleService } from "squacapi";
import { Observable } from "rxjs";
import { LoadingService } from "@core/services/loading.service";

/**
 * Resolves matching rules for a channel group
 */
@Injectable({
  providedIn: "root",
})
export class MatchingRuleResolver
  implements Resolve<Observable<MatchingRule[]>>
{
  constructor(
    private matchingRuleService: MatchingRuleService,
    private loadingService: LoadingService
  ) {}

  /**
   * Resolve matching rules for a channel group
   *
   * @param route activated route
   * @returns observable of results
   */
  resolve(route: ActivatedRouteSnapshot): Observable<MatchingRule[]> {
    const id = route.paramMap.get("channelGroupId");
    const delay = 500;
    return this.loadingService.doLoading(
      this.matchingRuleService.list({
        group: `${id}`,
      }),
      null,
      null,
      delay
    );
  }
}
