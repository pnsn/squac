import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoadingService } from "@core/services/loading.service";
import { OrganizationService } from "squacapi";
import { Organization } from "squacapi";
import {
  catchError,
  EMPTY,
  Observable,
  Subscription,
  switchMap,
  tap,
} from "rxjs";

/**
 * Display list of organizations in squac
 */
@Component({
  selector: "user-organizations-view",
  templateUrl: "./organizations-view.component.html",
  styleUrls: ["./organizations-view.component.scss"],
})
export class OrganizationsViewComponent implements OnInit, OnDestroy {
  organizations: Organization[];
  subscription = new Subscription();
  constructor(
    public route: ActivatedRoute,
    public loadingService: LoadingService,
    private organizationsService: OrganizationService
  ) {}

  /**
   * Subscribe to params
   */
  ngOnInit(): void {
    const routeSub = this.route.data
      .pipe(
        tap((data) => {
          // this.error = false;
          this.organizations = data["organizations"];
        })
      )
      .subscribe();

    this.subscription.add(routeSub);
  }

  /**
   * Gets organizations
   *
   * @returns List of organizations
   */
  fetchData(): Observable<Organization[]> {
    return this.loadingService
      .doLoading(this.organizationsService.list(), this)
      .pipe(
        tap((results) => {
          this.organizations = results;
        }),
        catchError(() => {
          return EMPTY;
        })
      );
  }

  /**
   * Unsubscribe
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
