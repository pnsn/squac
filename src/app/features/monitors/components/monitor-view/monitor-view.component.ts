import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Alert } from "@features/monitors/models/alert";
import { Monitor } from "@features/monitors/models/monitor";
import { AlertsService } from "@features/monitors/services/alerts.service";
import { MonitorsService } from "@features/monitors/services/monitors.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";

@Component({
  selector: "app-monitor-view",
  templateUrl: "./monitor-view.component.html",
  styleUrls: ["./monitor-view.component.scss"],
})
export class MonitorViewComponent implements OnInit, AfterViewInit {
  monitors: Monitor[];

  selected: Monitor[];
  @ViewChild("monitorTable") table: any;
  selectedMonitorId: number;
  error: boolean;
  alerts: Alert[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertsService: AlertsService,
    private monitorsService: MonitorsService
  ) {}

  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  ngOnInit(): void {
    this.selected = [];

    this.route.parent.data.subscribe((data) => {
      if (data.monitors.error || data.alerts.error) {
        this.error = true;
      } else {
        this.error = false;
        this.monitors = data.monitors;
        this.alerts = data.alerts;
      }
    });

    if (this.route.firstChild) {
      this.selectedMonitorId = +this.route.firstChild.snapshot.params.monitorId;
      this.selectMonitor(this.selectedMonitorId);
    }
  }

  refresh() {
    this.alertsService.getAlerts().subscribe((alerts) => {
      this.alerts = alerts;
    });
    this.monitorsService.getMonitors().subscribe((monitors) => {
      this.monitors = monitors;
    });
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.selected = [...this.selected];
  }

  getAlert(id: number) {
    const alert = this.alerts.filter((a) => a.trigger.monitorId === id)[0];
    return alert ? alert : "no data";
  }

  getAlerts(id: number) {
    return this.alerts.filter((a) => a.trigger.monitorId === id);
  }

  addMonitor() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  // Getting a selected channel group and setting variables
  selectMonitor(selectedMonitorId: number) {
    this.selected = this.monitors.filter((cg) => {
      // Select row with channel group
      return cg.id === selectedMonitorId;
    });
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    // console.log('Detail Toggled', event);
  }

  // // onSelect function for data table selection
  // onSelect($event) { // When a row is selected, route the page and select that channel group
  //   const selectedId = $event.selected[0].id;
  //   if (selectedId) {
  //     this.router.navigate([selectedId], {relativeTo: this.route});
  //     this.selectedMonitorId = selectedId;
  //     this.selectMonitor(selectedId);
  //   }
  // }

  viewMonitor(id) {
    if (id) {
      this.router.navigate([id], { relativeTo: this.route });
      this.selectedMonitorId = id;
      this.selectMonitor(id);
    }
  }
}
