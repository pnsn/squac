import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Organization } from "@features/user/models/organization";

@Component({
  selector: "app-organizations-view",
  templateUrl: "./organizations-view.component.html",
  styleUrls: ["./organizations-view.component.scss"],
})
export class OrganizationsViewComponent implements OnInit {
  organizations: Organization[];
  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {
    const orgSub = this.route.data.subscribe((data) => {
      this.organizations = data.organizations;
    });
  }
}
