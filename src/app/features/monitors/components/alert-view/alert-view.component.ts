import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alert } from '@features/monitors/models/alert';
import { Monitor } from '@features/monitors/models/monitor';
import { AlertsService } from '@features/monitors/services/alerts.service';
import { MonitorsService } from '@features/monitors/services/monitors.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-alert-view',
  templateUrl: './alert-view.component.html',
  styleUrls: ['./alert-view.component.scss']
})
export class AlertViewComponent implements OnInit, OnDestroy {
  alerts: Alert[];
  interval;
  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  error: boolean;
  monitors: Monitor[];


  constructor(
    private alertsService: AlertsService,
    private route: ActivatedRoute,
    private monitorsService: MonitorsService
  ) { }

  ngOnInit(): void {
    this.route.parent.data.subscribe(
      data => {
        if (data.monitors.error || data.alerts.error){
          this.error = true;
        } else {
          this.error = false;
          this.monitors = data.monitors;
          this.findMonitorsForAlerts(data.alerts);
        }
      }
    );
  }

  refresh() {
    this.monitorsService.getMonitors().subscribe(
      monitors => {
        this.monitors = monitors;
      }
    );
    this.alertsService.getAlerts().subscribe(
      alerts => {
        this.findMonitorsForAlerts(alerts);
    });
  }
  // match alerts and monitors
  findMonitorsForAlerts(alerts: Alert[]) {
    this.alerts = [];
    if (this.monitors.length > 0 && alerts.length > 0){
      this.alerts = alerts.map(alert => {

        alert.monitor = this.monitors.find(m => m.id === alert.trigger.monitorId);
        return alert;
      });
    }

  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    clearInterval(this.interval);
  }
}
