import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { MessageService } from "@core/services/message.service";
import { Monitor } from "@monitor/models/monitor";
import { Trigger } from "@monitor/models/trigger";
import { MonitorService } from "@monitor/services/monitor.service";
import { TriggerService } from "@monitor/services/trigger.service";
import { merge, Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";

@Component({
  selector: "monitor-edit",
  templateUrl: "./monitor-edit.component.html",
  styleUrls: ["./monitor-edit.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class MonitorEditComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  id: number;
  editMode: boolean;
  orgId: number;
  monitor: Monitor;
  channelGroups: ChannelGroup[];
  metrics: Metric[];
  emailValidator: Validators = Validators.pattern(
    /^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4},?)+$/
  );
  hideRequiredMarker = true;
  floatLabel = "always";
  removeTriggerIDs = [];

  // form options
  intervalTypes: string[] = ["minute", "hour", "day"];
  stats: object[] = [
    { value: "count", name: "count" },
    { value: "sum", name: "sum" },
    { value: "avg", name: "average" },
    { value: "min", name: "minimum" },
    { value: "max", name: "maximum" },
  ];
  value_operators: object[] = [
    { value: "outsideof", name: "outside of" },
    { value: "within", name: "within" },
    { value: "==", name: "equal to" },
    { value: "<", name: "less than" },
    { value: "<=", name: "less than or equal to" },
    { value: ">", name: "greater than" },
    { value: ">=", name: "greater than or equal to" },
  ];
  num_channels_operators: object[] = [
    { value: "any", name: "any" },
    { value: "all", name: "all" },
    { value: "==", name: "exactly" },
    { value: ">", name: "more than" },
    { value: "<", name: "less than" },
  ];

  selectedChannelGroup: ChannelGroup;
  selectedMetric: Metric;
  monitorForm = this.formBuilder.group({
    name: ["", Validators.required],
    intervalCount: ["", [Validators.required, Validators.min(1)]],
    intervalType: ["", Validators.required],
    stat: ["", Validators.required],
    metric: ["", Validators.required],
    channelGroup: ["", Validators.required],
    triggers: this.formBuilder.array([]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private monitorService: MonitorService,
    public dialogRef: MatDialogRef<MonitorEditComponent>,
    private triggerService: TriggerService,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  // Set up form fields
  ngOnInit(): void {
    this.metrics = this.data.metrics;
    this.channelGroups = this.data.channelGroups;
    this.editMode = !!this.data.monitor;
    this.initForm();
  }

  // emitModelToViewChange: true,
  // // Access triggers
  get triggers(): FormArray {
    return this.monitorForm.get("triggers") as FormArray;
  }

  // Add trigger info to form
  makeTriggerForm(trigger?: Trigger): FormGroup {
    return this.formBuilder.group(
      {
        val1: [trigger ? trigger.val1 : null, Validators.required],
        val2: [trigger ? trigger.val2 : null],
        id: [trigger ? trigger.id : null],
        value_operator: [
          trigger ? trigger.value_operator : null,
          Validators.required,
        ],
        num_channels: [
          {
            value: trigger ? trigger.num_channels : null,
            disabled:
              trigger?.num_channels_operator === "any" ||
              trigger?.num_channels_operator === "all",
          },
        ],
        num_channels_operator: [
          trigger ? trigger.num_channels_operator : null,
          Validators.required,
        ],
        alert_on_out_of_alarm: [
          trigger ? trigger.alert_on_out_of_alarm : false,
        ],
        email_list: [trigger ? trigger.email_list : null, Validators.email], //this.emailValidator
      },
      { updateOn: "blur" }
    );
  }

  // Add a new trigger
  addTrigger(trigger?: Trigger): void {
    const triggerFormGroup = this.makeTriggerForm(trigger);
    triggerFormGroup.valueChanges.subscribe((value) => {
      this.validateTrigger(value, triggerFormGroup);
      triggerFormGroup.patchValue(value, { emitEvent: false });
    });
    this.triggers.push(triggerFormGroup);
  }

  // enable and disable trigger form controls
  validateTrigger(values, triggerFormGroup): void {
    const val2 = triggerFormGroup.get("val2");
    const num_channels = triggerFormGroup.get("num_channels");
    if (
      values.value_operator !== "outsideof" &&
      values.value_operator !== "within"
    ) {
      val2.setValue(null, { emitEvent: false });
      val2.disable({ emitEvent: false });
      val2.removeValidators(Validators.required, { emitEvent: false });
    } else {
      val2.addValidators(Validators.required, { emitEvent: false });
      val2.enable({ emitEvent: false });
    }
    if (
      values.num_channels_operator === "any" ||
      values.num_channels_operator === "all"
    ) {
      num_channels.setValue(null, { emitEvent: false });
      num_channels.disable({ emitEvent: false });
      num_channels.removeValidators(Validators.required, { emitEvent: false });
    } else {
      num_channels.enable({ emitEvent: false });
      num_channels.addValidators(Validators.required, { emitEvent: false });
    }
  }
  // Remove given trigger
  removeTrigger(index): void {
    const trigger = this.triggers.at(index).value;
    if (trigger.id) {
      this.removeTriggerIDs.push(+trigger.id);
    }
    this.triggers.removeAt(index);
  }

  // Save monitor to SQUACapi
  save(): void {
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
      this.triggers.value
    );

    this.monitorService
      .updateMonitor(monitor)
      .pipe(
        switchMap((m) => {
          return merge(
            ...this.triggerService.updateTriggers(
              this.triggers.value,
              this.removeTriggerIDs,
              m.id
            )
          );
        })
      )
      .subscribe({
        next: () => {
          this.messageService.message("Monitor saved.");
          this.cancel();
        },
        error: () => {
          this.messageService.error("Could not save monitor.");
        },
      });
  }

  // Cancel and don't save changes
  cancel(monitor?: Monitor): void {
    this.dialogRef.close(monitor);
    // route out of edit
  }

  // Fill in metric info
  private initForm(): void {
    if (this.editMode) {
      this.monitor = this.data.monitor;
      this.id = this.monitor.id;
      this.selectedChannelGroup = this.channelGroups.find(
        (cG) => cG.id === this.monitor.channelGroup.id
      );
      this.selectedMetric = this.metrics.find(
        (m) => m.id === this.monitor.metric.id
      );

      this.monitorForm.patchValue({
        name: this.monitor.name,
        intervalCount: this.monitor.intervalCount,
        intervalType: this.monitor.intervalType,
        stat: this.monitor.stat,
        channelGroup: this.selectedChannelGroup,
        metric: this.selectedMetric,
      });

      this.monitor.triggers.forEach((trigger) => {
        this.addTrigger(trigger);
      });
    } else {
      this.addTrigger(); //have default trigger ready
    }
  }

  // Kill any open subs
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
