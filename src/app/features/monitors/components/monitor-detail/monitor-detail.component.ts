import { Component, OnInit } from '@angular/core';
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
  monitor: Monitor;
  subscription: Subscription = new Subscription();
  error: boolean;
  metric: Metric;
  metrics: Metric[];
  channelGroups: ChannelGroup[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmDialog: ConfirmDialogService,
    private monitorService: MonitorsService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      data => {
        if (data.monitor.error){
          this.error = true;
        } else {
          this.error = false;
          this.monitor = data.monitor;
          console.log(this.monitor)
        }
      }
    );
  }

  editMonitor() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDelete() {
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
