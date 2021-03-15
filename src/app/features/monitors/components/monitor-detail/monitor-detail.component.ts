import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelGroup } from '@core/models/channel-group';
import { Metric } from '@core/models/metric';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { Monitor } from '@features/monitors/models/monitor';
import { MonitorsService } from '@features/monitors/services/monitors.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-monitor-detail',
  templateUrl: './monitor-detail.component.html',
  styleUrls: ['./monitor-detail.component.scss']
})
export class MonitorDetailComponent implements OnInit {
  @Input() monitor: Monitor;
  // monitor: Monitor;
  subscription: Subscription = new Subscription();
  error: boolean;
  @Input() metric: Metric;
  @Input() channelGroup: ChannelGroup[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmDialog: ConfirmDialogService,
    private monitorService: MonitorsService
  ) { }

  ngOnInit(): void {
    console.log(this.monitor)
    // this.route.data.subscribe(
    //   data => {
    //     if (data.monitor.error){
    //       this.error = true;
    //     } else {
    //       this.error = false;
    //       this.monitor = data.monitor;
    //     }
    //   }
    // );
  }

  editMonitor() {
    this.router.navigate([this.monitor.id, 'edit'], {relativeTo: this.route});
  }

  onDelete() {
    console.log("delete")
    this.confirmDialog.open(
      {
        title: `Delete ${this.monitor.name}`,
        message: 'Are you sure? This action is permanent.',
        cancelText: 'Cancel',
        confirmText: 'Delete'
      }
    );
    this.confirmDialog.confirmed().subscribe(
      confirm => {
        if (confirm) {
          this.deleteMonitor();
        }
    });
  }

  deleteMonitor() {
    this.monitorService.deleteMonitor(this.monitor.id).subscribe(
      success => {
        this.router.navigate(['/alarms/monitors']);
      }
    )
  }
}
