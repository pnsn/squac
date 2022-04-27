import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Dashboard } from "../../models/dashboard";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { DashboardService } from "../../services/dashboards.service";
import { Subscription } from "rxjs";
import { UserService } from "@user/services/user.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "dashboard-edit",
  templateUrl: "./dashboard-edit.component.html",
  styleUrls: ["./dashboard-edit.component.scss"],
})
export class DashboardEditComponent implements OnInit, OnDestroy {
  dashboard: Dashboard;
  editMode: boolean;
  orgId: number;
  dashboardForm: FormGroup;
  subscriptions: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DashboardEditComponent>,
    private dashboardService: DashboardService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.dashboard = this.data.dashboard;
    this.dashboardForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      share: ["private", Validators.required],
    });

    this.editMode = !!this.dashboard;
    this.orgId = this.userService.userOrg;
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initForm() {
    if (this.editMode) {
      let share = "private";
      if (this.dashboard.shareAll) {
        share = "shareAll";
      } else if (this.dashboard.shareOrg) {
        share = "shareOrg";
      }
      this.dashboardForm.patchValue({
        name: this.dashboard.name,
        description: this.dashboard.description,
        share,
      });
    }
  }

  save() {
    const values = this.dashboardForm.value;
    const shareAll = values.share === "shareAll";
    const shareOrg = values.share === "shareOrg" || shareAll;
    const id = this.dashboard ? this.dashboard.id : null;
    this.dashboardService
      .updateDashboard(
        new Dashboard(
          id,
          null,
          values.name,
          values.description,
          shareOrg,
          shareAll,
          this.orgId,
          this.dashboard && this.dashboard.widgets
            ? this.dashboard.widgetIds
            : []
        )
      )
      .subscribe({
        next: (result) => {
          console.log("done");
          this.cancel(result.id);
        },
        error: (error) => {
          console.log("error in save dashboard: " + error);
        },
      });
  }
  // Cancel and don't save changes
  cancel(dashboardId?: number) {
    this.dialogRef.close(dashboardId);
    // route out of edit
  }
}
