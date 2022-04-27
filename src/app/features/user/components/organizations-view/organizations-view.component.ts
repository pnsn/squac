import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Organization } from "@user/models/organization";
import { Subscription } from "rxjs";

@Component({
  selector: "app-organizations-view",
  templateUrl: "./organizations-view.component.html",
  styleUrls: ["./organizations-view.component.scss"],
})
export class OrganizationsViewComponent implements OnInit, OnDestroy {
  organizations: Organization[];
  orgSub: Subscription;
  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.orgSub = this.route.data.subscribe((data) => {
      this.organizations = data.organizations;
    });
  }

  ngOnDestroy(): void {
    this.orgSub.unsubscribe();
  }
}
