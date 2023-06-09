import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Dashboard } from "squacapi";
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { DashboardService } from "squacapi";
import { Subscription } from "rxjs";
import { UserService } from "@user/services/user.service";
import {
  MatDialogRef,
  MAT_DIALOG_DATA as MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MessageService } from "@core/services/message.service";
import { ChannelGroup } from "squacapi";
import { FilterText } from "@shared/components/sharing-toggle/sharing-toggle.interface";

/** dashboard edit form */
interface DashboardForm {
  /** dashboard name */
  name: FormControl<string>;
  /** dashboard description */
  description: FormControl<string>;
}
/**
 * Dashboard edit component
 */
@Component({
  selector: "dashboard-edit",
  templateUrl: "./dashboard-edit.component.html",
  styleUrls: ["./dashboard-edit.component.scss"],
})
export class DashboardEditComponent implements OnInit, OnDestroy {
  /** rxjs subscriptions */
  subscriptions: Subscription = new Subscription();
  /** dashboard to edit */
  dashboard: Dashboard;
  /** true if editing, false if creating */
  editMode: boolean;
  /** user's orgId */
  orgId: number;
  /** available channel groups */
  channelGroups: ChannelGroup[];
  /** selected channel group id */
  channelGroupId: number;
  /** dashboard edit form */
  dashboardForm: FormGroup<DashboardForm> = this.formBuilder.group({
    name: ["", Validators.required],
    description: ["", Validators.required],
  });

  /** dashboard shareAll setting*/
  shareAll = false;
  /** dashboard shareORg setting */
  shareOrg = false;

  /** text options for filter select */
  filterText: FilterText = {
    user: "Private",
    all: "Public",
  };

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DashboardEditComponent>,
    private dashboardService: DashboardService,
    private userService: UserService,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   * Init properties
   */
  ngOnInit(): void {
    this.dashboard = this.data["dashboard"];
    if (this.dashboard) {
      this.channelGroupId = this.dashboard.channelGroupId;
    }
    if (this.data.channelGroupId) {
      this.channelGroupId = this.data["channelGroupId"];
    }
    this.channelGroups = this.data["channelGroups"];
    this.editMode = !!this.dashboard;
    this.orgId = this.userService.userOrg;
    this.initForm();
  }

  /**
   * unsubscribe
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Set up edit form
   */
  private initForm(): void {
    if (this.editMode) {
      this.shareAll = this.dashboard.shareAll;
      this.shareOrg = this.dashboard.shareOrg;
      this.dashboardForm.patchValue({
        name: this.dashboard.name,
        description: this.dashboard.description,
      });
    }
  }

  /**
   * Saves dashboard
   */
  save(): void {
    const values = this.dashboardForm.value;
    const id = this.dashboard ? this.dashboard.id : null;

    const dashboard = new Dashboard({
      id: id,
      name: values.name,
      shareAll: this.shareAll,
      shareOrg: this.shareOrg,
      organization: this.orgId,
      channelGroupId: this.channelGroupId,
    });

    if (id) {
      dashboard.properties = this.dashboard.properties;
    }

    this.dashboardService.updateOrCreate(dashboard).subscribe({
      next: (dashboardId: number) => {
        this.messageService.message("Dashboard saved.");
        this.cancel(dashboardId);
      },
      error: () => {
        this.messageService.error("Could not save dashboard.");
      },
    });
  }

  /**
   * Cancel and close modal
   *
   * @param dashboardId dashboard id
   */
  cancel(dashboardId?: number): void {
    this.dialogRef.close(dashboardId);
  }
}
