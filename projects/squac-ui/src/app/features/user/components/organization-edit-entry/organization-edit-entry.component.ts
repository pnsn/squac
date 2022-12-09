import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Organization } from "squacapi";
import { User } from "squacapi";
import { Subscription } from "rxjs";
import { OrganizationEditComponent } from "../organization-edit/organization-edit.component";

/**
 * Entry component for edit modal
 * Used as routing endpoint
 */
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

  /**
   * Subscribe to route params
   */
  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe(() => {
      this.userId = +this.route.snapshot.params["userId"];
      this.organization = this.route.snapshot.data["organization"];
      this.user = this.organization.users.find((u) => {
        return u.id === this.userId;
      });

      if (this.organization) {
        this.openUser();
      }
    });
  }

  /**
   * Opens user edit modal
   */
  openUser(): void {
    this.dialogRef = this.dialog.open(OrganizationEditComponent, {
      closeOnNavigation: true,
      data: {
        user: this.user,
        orgId: this.organization.id,
      },
    });
    this.dialogRef.afterClosed().subscribe({
      next: () => {
        if (this.userId) {
          this.router.navigate(["../../../"], { relativeTo: this.route });
        } else {
          this.router.navigate(["../../"], { relativeTo: this.route });
        }
      },
    });
  }

  /** closes modal and unsubscribes */
  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.paramsSub.unsubscribe();
  }
}
