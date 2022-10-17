import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Dashboard } from "../../models/dashboard";
import {
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
} from "@angular/forms";
import { DashboardService } from "../../services/dashboard.service";
import { Subscription } from "rxjs";
import { UserService } from "@user/services/user.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MessageService } from "@core/services/message.service";
import { ChannelGroup } from "@core/models/channel-group";

@Component({
  selector: "dashboard-edit",
  templateUrl: "./dashboard-edit.component.html",
  styleUrls: ["./dashboard-edit.component.scss"],
})
export class DashboardEditComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  dashboard: Dashboard;
  editMode: boolean;
  orgId: number;
  channelGroups: ChannelGroup[];
  channelGroupId: number;
  dashboardForm: UntypedFormGroup = this.formBuilder.group({
    name: ["", Validators.required],
    description: ["", Validators.required],
    share: ["private", Validators.required],
  });

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<DashboardEditComponent>,
    private dashboardService: DashboardService,
    private userService: UserService,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.dashboard = this.data.dashboard;
    if (this.dashboard) {
      this.channelGroupId = this.dashboard.channelGroupId;
    }
    if (this.data.channelGroupId) {
      this.channelGroupId = this.data.channelGroupId;
    }
    this.channelGroups = this.data.channelGroups;
    this.editMode = !!this.dashboard;
    this.orgId = this.userService.userOrg;
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // set up form
  private initForm(): void {
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

  // save dashboard
  save(): void {
    const values = this.dashboardForm.value;
    const shareAll = values.share === "shareAll";
    const shareOrg = values.share === "shareOrg" || shareAll;
    const id = this.dashboard ? this.dashboard.id : null;

    const dashboard = new Dashboard(
      id,
      null,
      values.name,
      values.description,
      shareOrg,
      shareAll,
      this.orgId,
      this.channelGroupId
    );
    if (id) {
      dashboard.properties = this.dashboard.properties;
    }

    this.dashboardService.updateOrCreate(dashboard).subscribe({
      next: (result) => {
        this.messageService.message("Dashboard saved.");
        this.cancel(result.id);
      },
      error: (error) => {
        this.messageService.error("Could not save dashboard.");
        console.error("error in save dashboard: ", error);
      },
    });
  }
  // Cancel and don't save changes
  cancel(dashboardId?: number): void {
    this.dialogRef.close(dashboardId);
    // route out of edit
  }
}
