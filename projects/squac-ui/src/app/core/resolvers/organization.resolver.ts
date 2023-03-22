import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { LoadingService } from "@core/services/loading.service";
import { ResolverService } from "@core/services/resolver.service";
import { Observable } from "rxjs";
import { Organization, OrganizationService } from "squacapi";

/**
 * Resolver for organization or list of organizations
 */
@Injectable({
  providedIn: "root",
})
export class OrganizationResolver
  implements Resolve<Observable<Organization | Organization[]>>
{
  constructor(
    private orgService: OrganizationService,
    private loadingService: LoadingService
  ) {}

  /**
   * Resolve organization or list of organizations
   *
   * @param route activated route
   * @returns observable of results
   */
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<Organization | Organization[]> {
    const id = route.paramMap.get("orgId");
    const delay = 1000;
    let req;
    if (id) {
      req = this.orgService.read(+id);
    } else {
      req = this.orgService.list();
    }
    return this.loadingService.doLoading(req, null, null, delay);
  }
}
