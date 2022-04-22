import { Component, OnInit, OnDestroy } from "@angular/core";
import { Dashboard } from "../../models/dashboard";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { DashboardsService } from "../../services/dashboards.service";
import { Subscription } from "rxjs";
import { UserService } from "@features/user/services/user.service";

@Component({
  selector: "app-dashboard-edit",
  templateUrl: "./dashboard-edit.component.html",
  styleUrls: ["./dashboard-edit.component.scss"],
})
export class DashboardEditComponent implements OnInit, OnDestroy {
  id: number;
  dashboard: Dashboard;
  editMode: boolean;
  orgId: number;
  dashboardForm: FormGroup;
  subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MonitorEditEntryComponent>,
    private dashboardService: DashboardsService,
    private userService: UserService
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.dashboardForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      share: ["private", Validators.required],
    });

    const paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.dashboardId;
        this.editMode = !!this.id;
        this.orgId = this.userService.userOrg;
        this.initForm();
      },
      (error) => {
        console.log("error getting params: " + error);
      }
    );

    this.subscriptions.add(paramsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initForm() {
    if (this.editMode) {
      this.dashboard = this.route.snapshot.data.dashboard;
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

    this.dashboardService
      .updateDashboard(
        new Dashboard(
          this.id,
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
      .subscribe(
        (result) => {
          this.cancel(result.id);
        },
        (error) => {
          console.log("error in save dashboard: " + error);
        }
      );
  }
   // Cancel and don't save changes
   cancel(dashboardId?: number) {
    this.dialogRef.close(monitor);
    // route out of edit
  }


  cancel(id?: number) {
    if (id && !this.id) {
      this.router.navigate(["../", id], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }
}
