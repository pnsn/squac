import { Component, OnInit, OnDestroy } from '@angular/core';
import { MonitorEditComponent } from '../monitor-edit/monitor-edit.component';
import { ViewService } from '@core/services/view.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MonitorsService } from '@features/monitors/services/monitors.service';

@Component({
  selector: 'app-monitor-edit-entry',
  templateUrl: './monitor-edit-entry.component.html',
  styleUrls: ['./monitor-edit-entry.component.scss']
})
export class MonitorEditEntryComponent implements OnInit, OnDestroy {
  dialogRef;
  monitorId;
  paramsSub;
  metrics;
  channelGroups;
  monitor;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private monitorsService: MonitorsService
  ) { }

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.monitorId = +params.monitorId;

        if (this.route.parent) {
          this.monitor = this.route.parent.snapshot.data.monitor;
        }
        if (this.route.snapshot && this.route.snapshot.data) {
          this.metrics = this.route.snapshot.data.metrics;
          this.channelGroups = this.route.snapshot.data.channelGroups;
        }

        if (this.monitorId && !this.monitor) {
          this.monitorsService.getMonitor(this.monitorId).subscribe(
            monitor => {
              this.monitor = monitor;
              this.openMonitor();
            });
        } else {
          this.openMonitor();
        }



      }
    );

    if (this.dialogRef) {
      this.dialogRef.afterClosed().subscribe(
        result => {
          if (this.monitorId) {
            this.router.navigate(['../../'], {relativeTo: this.route});
          } else {
            this.router.navigate(['../'], {relativeTo: this.route});
          }
          // route to exit
        }, error => {
          console.log('error in monitor detail: ' + error);
        }
      );
    }
  }

  openMonitor( ) {
    this.dialogRef = this.dialog.open(MonitorEditComponent, {
      closeOnNavigation: true,
      width: '70vw',
      data : {
        monitor: this.monitor,
        metrics: this.metrics,
        channelGroups: this.channelGroups
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.paramsSub.unsubscribe();
  }

}
