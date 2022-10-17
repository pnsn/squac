import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
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
  channelGroups: any;
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
  valueOperators: object[] = [
    { value: "outsideof", name: "outside of" },
    { value: "within", name: "within" },
    { value: "==", name: "equal to" },
    { value: "<", name: "less than" },
    { value: "<=", name: "less than or equal to" },
    { value: ">", name: "greater than" },
    { value: ">=", name: "greater than or equal to" },
  ];
  numChannelsOperators: object[] = [
    { value: "any", name: "any" },
    { value: "all", name: "all" },
    { value: "==", name: "exactly" },
    { value: ">", name: "more than" },
    { value: "<", name: "less than" },
  ];

  selectedChannelGroup: ChannelGroup;
  selectedMetric: Metric;
  groups: any;
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
    private formBuilder: UntypedFormBuilder,
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
  get triggers(): UntypedFormArray {
    return this.monitorForm.get("triggers") as UntypedFormArray;
  }

  // Add trigger info to form
  makeTriggerForm(trigger?: Trigger): UntypedFormGroup {
    return this.formBuilder.group(
      {
        val1: [trigger ? trigger.val1 : null, Validators.required],
        val2: [trigger ? trigger.val2 : null],
        id: [trigger ? trigger.id : null],
        valueOperator: [
          trigger ? trigger.valueOperator : null,
          Validators.required,
        ],
        numChannels: [
          {
            value: trigger ? trigger.numChannels : null,
            disabled:
              trigger?.numChannelsOperator === "any" ||
              trigger?.numChannelsOperator === "all",
          },
        ],
        numChannelsOperator: [
          trigger ? trigger.numChannelsOperator : null,
          Validators.required,
        ],
        alertOnOutOfAlarm: [trigger ? trigger.alertOnOutOfAlarm : false],
        emailList: [trigger ? trigger.emailList : null, Validators.email], //this.emailValidator
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
    const numChannels = triggerFormGroup.get("numChannels");
    if (
      values.valueOperator !== "outsideof" &&
      values.valueOperator !== "within"
    ) {
      val2.setValue(null, { emitEvent: false });
      val2.disable({ emitEvent: false });
      val2.removeValidators(Validators.required, { emitEvent: false });
    } else {
      val2.addValidators(Validators.required, { emitEvent: false });
      val2.enable({ emitEvent: false });
    }
    if (
      values.numChannelsOperator === "any" ||
      values.numChannelsOperator === "all"
    ) {
      numChannels.setValue(null, { emitEvent: false });
      numChannels.disable({ emitEvent: false });
      numChannels.removeValidators(Validators.required, { emitEvent: false });
    } else {
      numChannels.enable({ emitEvent: false });
      numChannels.addValidators(Validators.required, { emitEvent: false });
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
      values.channelGroup,
      values.metric.id,
      values.intervalType,
      values.intervalCount,
      values.stat,
      null,
      this.triggers.value
    );

    this.monitorService
      .updateOrCreate(monitor)
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

      this.selectedMetric = this.metrics.find(
        (m) => m.id === this.monitor.metric.id
      );

      this.monitorForm.patchValue({
        name: this.monitor.name,
        intervalCount: this.monitor.intervalCount,
        intervalType: this.monitor.intervalType,
        stat: this.monitor.stat,
        channelGroup: this.monitor.channelGroup.id,
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
