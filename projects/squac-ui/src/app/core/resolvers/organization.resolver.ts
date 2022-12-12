import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
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
  constructor(private orgService: OrganizationService) {}

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
    if (id) {
      return this.orgService.read(+id);
    } else {
      return this.orgService.list();
    }
  }
}
