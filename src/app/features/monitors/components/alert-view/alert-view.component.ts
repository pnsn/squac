import { Component, OnInit } from '@angular/core';
import { AlertsService } from '@features/monitors/services/alerts.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-alert-view',
  templateUrl: './alert-view.component.html',
  styleUrls: ['./alert-view.component.scss']
})
export class AlertViewComponent implements OnInit {
  alerts;
  interval;
  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  constructor(
    private alertsService: AlertsService
  ) { }

  ngOnInit(): void {
    this.getAlerts();
    this.interval = setInterval(
      this.getAlerts,
      60 * 1000
    );
  }

  getAlerts() {
    this.alertsService.getAlerts().subscribe(
      alerts => {
        this.alerts = alerts;
      }
    );

  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    clearInterval(this.interval);
  }
}
