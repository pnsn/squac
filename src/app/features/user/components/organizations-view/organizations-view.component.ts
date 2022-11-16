import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoadingService } from "@core/services/loading.service";
import { OrganizationService } from "@squacapi/services";
import { Organization } from "@squacapi/models";
import { catchError, EMPTY, Subscription, switchMap, tap } from "rxjs";

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

  fetchData() {
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
