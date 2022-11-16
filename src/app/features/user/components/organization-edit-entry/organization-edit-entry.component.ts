import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Organization } from "@squacapi/models";
import { User } from "@squacapi/models";
import { Subscription } from "rxjs";
import { OrganizationEditComponent } from "../organization-edit/organization-edit.component";

@Component({
  selector: "user-organization-edit-entry",
  template: "",
})
export class OrganizationEditEntryComponent implements OnInit, OnDestroy {
  dialogRef: MatDialogRef<OrganizationEditComponent>;
  userId: number;
  paramsSub: Subscription;
  user: User;
  organization: Organization;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe(() => {
      this.userId = +this.route.snapshot.params.userId;
      this.organization = this.route.snapshot.data.organization;
      this.user = this.organization.users.find((u) => {
        return u.id === this.userId;
      });

      if (this.organization) {
        this.openUser();
      }
    });
  }

  openUser(): void {
    this.dialogRef = this.dialog.open(OrganizationEditComponent, {
      closeOnNavigation: true,
      data: {
        user: this.user,
        orgId: this.organization.id,
      },
    });
    this.dialogRef.afterClosed().subscribe(
      () => {
        if (this.userId) {
          this.router.navigate(["../../../"], { relativeTo: this.route });
        } else {
          this.router.navigate(["../../"], { relativeTo: this.route });
        }

        // route to exit
      },
      (error) => {
        console.error("error in monitor detail: ", error);
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
