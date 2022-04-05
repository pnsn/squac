import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChannelGroup } from '@core/models/channel-group';
import { Metric } from '@core/models/metric';
import { MessageService } from '@core/services/message.service';
import { Monitor } from '@features/monitors/models/monitor';
import { Trigger } from '@features/monitors/models/trigger';
import { MonitorsService } from '@features/monitors/services/monitors.service';
import { TriggersService } from '@features/monitors/services/triggers.service';
import { merge, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MonitorEditEntryComponent } from '../monitor-edit-entry/monitor-edit-entry.component';

@Component({
  selector: 'app-monitor-edit',
  templateUrl: './monitor-edit.component.html',
  styleUrls: ['./monitor-edit.component.scss']
})
export class MonitorEditComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  id: number;
  editMode: boolean;
  orgId: number;
  monitor: Monitor;
  monitorForm: FormGroup;
  channelGroups: ChannelGroup[];
  metrics: Metric[];
  constructor(
    private formBuilder: FormBuilder,
    private monitorsService: MonitorsService,
    public dialogRef: MatDialogRef<MonitorEditEntryComponent>,
    private triggersService: TriggersService,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  intervalTypes: string[] = ['minute', 'hour', 'day'];
  stats: string[] = ['count', 'sum', 'avg', 'min', 'max'];
  value_operators: string[] = ['outsideof', 'within', '==','<', '<=', '>', '>='];
  channels_operators: string[] = ['any', '==', '<', '>'];
  levels: number[] = [1, 2, 3];
  // selectedType;
  // selectedStat;
  selectedChannelGroup: ChannelGroup;
  selectedMetric: Metric;

  ngOnInit() {
    this.monitorForm = this.formBuilder.group({
      name: ['', Validators.required],
      intervalCount: ['', [ Validators.required, Validators.min(1)]],
      intervalType: ['', Validators.required],
      stat: ['', Validators.required],
      metric: ['', Validators.required],
      channelGroup: ['', Validators.required],
      defaultTrigger: this.formBuilder.group({}),
      triggers: this.formBuilder.array([])
    });

    this.metrics = this.data.metrics;
    this.channelGroups = this.data.channelGroups;
    this.editMode = !!this.data.monitor;
    this.initForm();
  }

  get triggers(){
    return this.monitorForm.get('triggers') as FormArray;
  }

  makeTriggerForm (trigger?: Trigger) {
    return this.formBuilder.group({
      val1: [trigger ? trigger.val1 : null],
      val2: [trigger ? trigger.val2 : null],
      level: [trigger ? trigger.level : null],
      id: [trigger ? trigger.id : null],
      value_operator: [trigger ? trigger.value_operator : null ],
      num_channels:[trigger ? trigger.num_channels : null ],
      num_channels_operator:[trigger ? trigger.num_channels_operator : null ],
      alert_on_out_of_alarm: [trigger ? trigger.alert_on_out_of_alarm : null ],
      email_list:[trigger ? trigger.email_list : null ]
    });
  }

  addTrigger(trigger?: Trigger) {
    this.triggers.push(this.makeTriggerForm(trigger));
  }

  removeTrigger(index){
    const trigger = this.triggers.at(index).value;
    if (trigger.id) {
      this.triggers.at(index).setValue({
        id: trigger.id,
        val1: null,
        val2: null,
        level: null,
        value_operator: null,
        num_channels: null,
        num_channels_operator: null,
        alert_on_out_of_alarm: null,
        email_list: null
      });
    } else {
      this.triggers.removeAt(index);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  save() {
    const values = this.monitorForm.value;

    const monitor = new Monitor(
      this.id,
      values.name,
      values.channelGroup.id,
      values.metric.id,
      values.intervalType,
      values.intervalCount,
      values.stat,
      null,
      values.triggers
    );

    this.monitorsService.updateMonitor(
      monitor
    ).pipe(
      switchMap(m => {
        return merge(...this.triggersService.updateTriggers(values.triggers, m.id));
      })
    ).subscribe(
      {
        next: () => {
          this.messageService.message('Monitor saved.');
          this.cancel();
        },
        error: () => {
          this.messageService.error('Could not save monitor.');
        }
      }
    );
  }

  cancel(monitor?: Monitor) {
    this.dialogRef.close(monitor);
    // route out of edit
  }

  private initForm() {

    if (this.editMode) {
      this.monitor = this.data.monitor;
      this.id = this.monitor.id;
      this.selectedChannelGroup = this.channelGroups.find(cG => cG.id === this.monitor.channelGroup.id);
      this.selectedMetric = this.metrics.find(m => m.id === this.monitor.metric.id);

      this.monitorForm.patchValue(
        {
          name: this.monitor.name,
          intervalCount: this.monitor.intervalCount,
          intervalType: this.monitor.intervalType,
          stat: this.monitor.stat,
          channelGroup: this.selectedChannelGroup,
          metric: this.selectedMetric
        }
      );

      this.monitor.triggers.forEach((trigger, i) => {
        if (i == 0) {
          this.monitorForm.patchValue(this.makeTriggerForm(trigger));
        } else {
          this.addTrigger(trigger);
        }
      });

    }
  }
}
