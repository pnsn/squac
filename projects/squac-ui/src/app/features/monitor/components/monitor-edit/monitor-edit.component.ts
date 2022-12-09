import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ChannelGroup } from "squacapi";
import { Metric } from "squacapi";
import { MessageService } from "@core/services/message.service";
import { Monitor } from "squacapi";
import { Trigger } from "squacapi";
import { MonitorService } from "squacapi";
import { TriggerService } from "squacapi";
import { merge, Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";

/**
 * Component for editing monitors
 */
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
  stats: any[] = [
    { value: "count", name: "count" },
    { value: "sum", name: "sum" },
    { value: "avg", name: "average" },
    { value: "min", name: "minimum" },
    { value: "max", name: "maximum" },
  ];
  valueOperators: any[] = [
    { value: "outsideof", name: "outside of" },
    { value: "within", name: "within" },
    { value: "==", name: "equal to" },
    { value: "<", name: "less than" },
    { value: "<=", name: "less than or equal to" },
    { value: ">", name: "greater than" },
    { value: ">=", name: "greater than or equal to" },
  ];
  numChannelsOperators: any[] = [
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

  /** Get initial data */
  ngOnInit(): void {
    this.metrics = this.data["metrics"];
    this.channelGroups = this.data["channelGroups"];
    this.editMode = !!this.data["monitor"];
    this.initForm();
  }

  /** @returns Trigger form array */
  get triggers(): UntypedFormArray {
    return this.monitorForm.get("triggers") as UntypedFormArray;
  }

  /**
   * Add a new trigger to the form
   *
   * @param trigger trigger to add, empty if blank form
   * @returns trigger form group
   */
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

  /**
   * Add new trigger and subscribe to changes
   *
   * @param trigger trigger to add
   */
  addTrigger(trigger?: Trigger): void {
    const triggerFormGroup = this.makeTriggerForm(trigger);
    triggerFormGroup.valueChanges.subscribe((value) => {
      this.validateTrigger(value, triggerFormGroup);
      triggerFormGroup.patchValue(value, { emitEvent: false });
    });
    this.triggers.push(triggerFormGroup);
  }

  // enable and disable trigger form controls
  /**
   * Enable and disables trigger from controls depending
   * on which values are set
   *
   * @param values form values
   * @param triggerFormGroup changed form group
   */
  validateTrigger(values, triggerFormGroup): void {
    const val2 = triggerFormGroup.get("val2");
    const numChannels = triggerFormGroup.get("numChannels");

    // if not outside of or within, val2 not required
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

    // if not any or all, numChannels not required
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

  /**
   * Removes trigger at index
   *
   * @param index index in form array
   */
  removeTrigger(index: number): void {
    const trigger = this.triggers.at(index).value;
    if (trigger.id) {
      this.removeTriggerIDs.push(+trigger.id);
    }
    this.triggers.removeAt(index);
  }

  /** Saves monitor to squacapi */
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

  /**
   * Cancel without saving changes
   *
   * @param monitor monitor if editing
   */
  cancel(monitor?: Monitor): void {
    this.dialogRef.close(monitor);
  }

  /**
   * Populate monitor info in form
   */
  private initForm(): void {
    if (this.editMode) {
      this.monitor = this.data["monitor"];
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

  /** unsubscribe */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
