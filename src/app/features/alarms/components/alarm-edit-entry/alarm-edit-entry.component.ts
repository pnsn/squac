import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlarmEditComponent } from '../alarm-edit/alarm-edit.component';
import { ViewService } from '@core/services/view.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AlarmsService } from '@features/alarms/services/alarms.service';

@Component({
  selector: 'app-alarm-edit-entry',
  templateUrl: './alarm-edit-entry.component.html',
  styleUrls: ['./alarm-edit-entry.component.scss']
})
export class AlarmEditEntryComponent implements OnInit, OnDestroy {
  dialogRef;
  alarmId;
  paramsSub;
  dashboardId;
  statTypes;
  metrics;
  channelGroups;
  alarm;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private alarmsService: AlarmsService
  ) { }

  ngOnInit(): void {

    this.paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.alarmId = +params.alarmId;


        if (this.route.parent) {
          this.alarm = this.route.parent.snapshot.data.alarm;
        }
        if (this.route.snapshot && this.route.snapshot.data) {
          this.metrics = this.route.snapshot.data.metrics;
          this.channelGroups = this.route.snapshot.data.channelGroups;
        }

        if (this.alarmId && !this.alarm) {
          this.alarmsService.getAlarm(this.alarmId).subscribe(
            alarm => {
              this.alarm = alarm;
              this.openAlarm();
            });
        } else {
          this.openAlarm();
        }



      }
    );

    if (this.dialogRef) {
      this.dialogRef.afterClosed().subscribe(
        result => {
          if (this.alarmId) {
            this.router.navigate(['../../'], {relativeTo: this.route});
          } else {
            this.router.navigate(['../'], {relativeTo: this.route});
          }
          // route to exit
        }, error => {
          console.log('error in alarm detail: ' + error);
        }
      );
    }
  }

  openAlarm( ) {
    this.dialogRef = this.dialog.open(AlarmEditComponent, {
      closeOnNavigation: true,
      data : {
        width: '70vw',
        alarm: this.alarm,
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