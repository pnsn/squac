import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alert } from '@features/monitors/models/alert';
import { Monitor } from '@features/monitors/models/monitor';
import { AlertsService } from '@features/monitors/services/alerts.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-alert-view',
  templateUrl: './alert-view.component.html',
  styleUrls: ['./alert-view.component.scss']
})
export class AlertViewComponent implements OnInit {
  alerts: Alert[];
  interval;
  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  error: boolean;
  monitors: Monitor[];
  @ViewChild('alertTable') table: any;

  constructor(
    private alertsService: AlertsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getAlerts();
    this.interval = setInterval(
      ()=>{this.getAlerts()},
      60 * 1000
    );

    this.route.data.subscribe(
      data => {
        if (data.monitor.error){
          this.error = true;
        } else {
          this.error = false;
          this.monitors = data.monitor;
        }
      }
    );
  }

  // request alerts from squac
  getAlerts() {
    this.alertsService.getAlerts().subscribe(
      alerts => {
        console.log(alerts)
        this.findMonitorsForAlerts(alerts);
        //need to group alarms by trigger
      }
    );

  }

  // match alerts and monitors
  findMonitorsForAlerts(alerts: Alert[]) {
    this.alerts = [];
    if(this.monitors.length > 0 && alerts.length>0){
      console.log(alerts.length)
      this.alerts = alerts.map(alert => {
        
        alert.monitor = this.monitors.find(m => m.id === alert.trigger.monitorId);
        return alert;
      })
    }

  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    // console.log('Detail Toggled', event);
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    clearInterval(this.interval);
  }
}
