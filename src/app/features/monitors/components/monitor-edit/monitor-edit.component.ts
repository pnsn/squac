import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, ActivationEnd, Params } from '@angular/router';
import { ChannelGroup } from '@core/models/channel-group';
import { Metric } from '@core/models/metric';
import { Monitor } from '@features/monitors/models/monitor';
import { MonitorsService } from '@features/monitors/services/monitors.service';
import { UserService } from '@features/user/services/user.service';
import { Subscription } from 'rxjs';
import { MonitorEditEntryComponent } from '../monitor-edit-entry/monitor-edit-entry.component';

@Component({
  selector: 'app-monitor-edit',
  templateUrl: './monitor-edit.component.html',
  styleUrls: ['./monitor-edit.component.scss']
})
export class MonitorEditComponent implements OnInit {
  subscriptions : Subscription = new Subscription();
  id: number;
  editMode:boolean;
  orgId: number;
  monitor: Monitor;
  monitorForm: FormGroup;
  channelGroups: ChannelGroup[];
  metrics: Metric[];
  constructor(
    private formBuilder: FormBuilder,
    private monitorsService: MonitorsService,
    public dialogRef: MatDialogRef<MonitorEditEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  intervalTypes : string[] = ["minute", "hour", "day"];
  stats : string[] = ["count", "sum", "avg", "min", "max"];
  levels: string[] = ["1", "2", "3"]
  // selectedType;
  // selectedStat;
  selectedChannelGroup: ChannelGroup;
  selectedMetric: Metric;

  ngOnInit() {
    this.monitorForm = this.formBuilder.group({
      name: ['', Validators.required],
      intervalCount: ['', Validators.required],
      numberChannels: ['', Validators.required],
      intervalType: ['', Validators.required],
      stat: ['', Validators.required],
      channelGroup: ['', Validators.required],
      metric: ['', Validators.required],
      triggers: this.formBuilder.array(
       [] 
      )
    });

    this.metrics = this.data.metrics;
    this.channelGroups = this.data.channelGroups;
    this.editMode = !!this.data.monitor;
    console.log(this.data.monitor)
    this.initForm();
  }

  get triggers(){
    return this.monitorForm.get('triggers') as FormArray;
  }  

  addTrigger() {
    this.triggers.push( this.formBuilder.group({
      min: [''],
      max: [''],
      inclusive: [''],
      level: []         
    }));
  }

  removeThreshold(index){
    console.log(index)
    this.triggers.removeAt(index);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  save() {
    console.log(this.monitorForm.value)
    this.monitorsService.updateMonitor(
      this.monitorForm.value
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

  cancel(monitor?: Monitor) {
    this.dialogRef.close(monitor);
  }

  private initForm() {

    if (this.editMode) {
      this.monitor = this.data.monitor;
      this.selectedChannelGroup = this.channelGroups.find(cG => cG.id === this.monitor.channelGroupId);
      this.selectedMetric = this.metrics.find(m => m.id === this.monitor.metricId);

      this.monitorForm.patchValue(
        {
          name: this.monitor.name,
          intervalCount: this.monitor.intervalCount,
          numberChannels: this.monitor.numberChannels,
          intervalType: this.monitor.intervalType,
          stat: this.monitor.stat,
          channelGroup: this.selectedChannelGroup,
          metric: this.selectedMetric
        }
      );


    }
  }
}
