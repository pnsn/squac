import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Organization } from "@user/models/organization";
import { User } from "@user/models/user";
import { OrganizationEditComponent } from "../organization-edit/organization-edit.component";

@Component({
  selector: "app-organization-edit-entry",
  template: "",
})
export class OrganizationEditEntryComponent implements OnInit, OnDestroy {
  dialogRef;
  userId;
  paramsSub;
  user: User;
  organization: Organization;
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe(() => {
      if (this.route.parent) {
        this.userId = +this.route.snapshot.params.userId;
        this.organization = this.route.parent.snapshot.data.organization;
        this.user = this.organization.users.find((u) => {
          return u.id === this.userId;
        });
      }
      this.openUser();
    });
  }

  openUser() {
    this.dialogRef = this.dialog.open(OrganizationEditComponent, {
      closeOnNavigation: true,
      data: {
        user: this.user,
        orgId: this.organization.id,
      },
    });
    this.dialogRef.afterClosed().subscribe(
      (id?: number) => {
        if (this.userId) {
          this.router.navigate(["../../../"], { relativeTo: this.route });
        } else {
          this.router.navigate(["../../"], { relativeTo: this.route });
        }

        // route to exit
      },
      (error) => {
        console.log("error in monitor detail: " + error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.paramsSub.unsubscribe();
  }
}
