import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MessageService } from "@core/services/message.service";
import { Alert } from "@monitor/models/alert";
import { Monitor } from "@monitor/models/monitor";
import { MonitorService } from "@monitor/services/monitor.service";
import { Subscription } from "rxjs";

@Component({
  selector: "monitor-detail",
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
    private monitorService: MonitorService,
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
      () => {
        this.router.navigate(["/monitors"]);
        this.messageService.error("Monitor deleted.");
      },
      () => {
        this.messageService.error("Could not delete monitor.");
      }
    );
  }
}
