import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MessageService } from "@core/services/message.service";
import { Alert } from "@features/monitors/models/alert";
import { Monitor } from "@features/monitors/models/monitor";
import { MonitorsService } from "@features/monitors/services/monitors.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-monitor-detail",
  templateUrl: "./monitor-detail.component.html",
  styleUrls: ["./monitor-detail.component.scss"],
})
export class MonitorDetailComponent {
  @Input() monitor: Monitor;
  @Input() alerts: Alert;
  // monitor: Monitor;
  subscription: Subscription = new Subscription();
  error: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmDialog: ConfirmDialogService,
    private monitorService: MonitorsService,
    private messageService: MessageService
  ) {}

  editMonitor() {
    this.router.navigate([this.monitor.id, "edit"], { relativeTo: this.route });
  }

  onDelete() {
    console.log("delete");
    this.confirmDialog.open({
      title: `Delete ${this.monitor.name}`,
      message: "Are you sure? This action is permanent.",
      cancelText: "Cancel",
      confirmText: "Delete",
    });
    this.confirmDialog.confirmed().subscribe((confirm) => {
      if (confirm) {
        this.deleteMonitor();
      }
    });
  }

  deleteMonitor() {
    this.monitorService.deleteMonitor(this.monitor.id).subscribe(
      (success) => {
        this.router.navigate(["/monitors"]);
        this.messageService.error("Monitor deleted.");
      },
      (error) => {
        this.messageService.error("Could not delete monitor.");
      }
    );
  }
}
