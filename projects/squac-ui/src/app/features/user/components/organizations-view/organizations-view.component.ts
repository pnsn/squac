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

  ngOnInit(): void {
    const orgSub = this.route.params
      .pipe(
        tap(() => {
          // this.error = false;
        }),
        switchMap(() => {
          return this.fetchData();
        })
      )
      .subscribe();

    this.subscription.add(orgSub);
  }

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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
