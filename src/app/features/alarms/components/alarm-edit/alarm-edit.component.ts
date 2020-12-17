import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, ActivationEnd, Params } from '@angular/router';
import { ChannelGroup } from '@core/models/channel-group';
import { Metric } from '@core/models/metric';
import { Alarm } from '@features/alarms/models/alarm';
import { AlarmsService } from '@features/alarms/services/alarms.service';
import { UserService } from '@features/user/services/user.service';
import { Subscription } from 'rxjs';
import { AlarmEditEntryComponent } from '../alarm-edit-entry/alarm-edit-entry.component';

@Component({
  selector: 'app-alarm-edit',
  templateUrl: './alarm-edit.component.html',
  styleUrls: ['./alarm-edit.component.scss']
})
export class AlarmEditComponent implements OnInit {
  subscriptions : Subscription = new Subscription();
  id: number;
  editMode:boolean;
  orgId: number;
  alarm: Alarm;
  alarmForm: FormGroup;
  channelGroups: ChannelGroup[];
  metrics: Metric[];
  constructor(
    private formBuilder: FormBuilder,
    private alarmsService: AlarmsService,
    public dialogRef: MatDialogRef<AlarmEditEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  intervalTypes : string[] = ["minute", "hour", "day"];
  stats : string[] = ["count", "sum", "avg", "min", "max"];
  // selectedType;
  // selectedStat;
  selectedChannelGroup: ChannelGroup;
  selectedMetric: Metric;

  ngOnInit() {
    this.alarmForm = this.formBuilder.group({
      name: ['', Validators.required],
      intervalCount: ['', Validators.required],
      numberChannels: ['', Validators.required],
      intervalType: ['', Validators.required],
      stat: ['', Validators.required],
      channelGroup: ['', Validators.required],
      metric: ['', Validators.required]
    });

    this.metrics = this.data.metrics;
    this.channelGroups = this.data.channelGroups;
    this.editMode = !!this.data.alarm;
    console.log(this.data.alarm)
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  save() {
    this.alarmsService.updateAlarm(
      this.alarmForm.value
    ).subscribe(
      success=> {
        console.log(success)
        // this.router.navigate()
      }
    )
    // this.widgetEditService.saveWidget().subscribe(
    //   () => {
    //     this.cancel();
    //   }
    // );
  }

  cancel(alarm?: Alarm) {
    this.dialogRef.close(alarm);
  }

  private initForm() {

    if (this.editMode) {
      this.alarm = this.data.alarm;
      this.selectedChannelGroup = this.channelGroups.find(cG => cG.id === this.alarm.channelGroupId);
      this.selectedMetric = this.metrics.find(m => m.id === this.alarm.metricId);

      this.alarmForm.patchValue(
        {
          name: this.alarm.name,
          intervalCount: this.alarm.intervalCount,
          numberChannels: this.alarm.numberChannels,
          intervalType: this.alarm.intervalType,
          stat: this.alarm.stat,
          channelGroup: this.selectedChannelGroup,
          metric: this.selectedMetric
        }
      );


    }
  }
}
