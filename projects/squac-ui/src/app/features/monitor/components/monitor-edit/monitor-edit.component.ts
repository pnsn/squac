import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  ChannelGroup,
  INTERVAL_TYPES,
  Monitor,
  MonitorService,
  MONITOR_STATS,
  NUM_CHANNELS_OPERATORS,
  Trigger,
  TriggerService,
  VALUE_OPERATORS,
  IntervalType,
  MonitorStatType,
  NumChannelsOperator,
  ValueOperator,
} from "squacapi";
import { Metric } from "squacapi";
import { MessageService } from "@core/services/message.service";
import { merge, Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";

interface TriggerForm {
  id: FormControl<number>;
  val1: FormControl<number>;
  val2: FormControl<number>;
  valueOperator: FormControl<ValueOperator>;
  numChannels: FormControl<number>;
  numChannelsOperator: FormControl<NumChannelsOperator>;
  alertOnOutOfAlarm: FormControl<boolean>;
  emailList: FormControl<string>;
}

interface MonitorForm {
  name: FormControl<string>;
  intervalCount: FormControl<number>;
  intervalType: FormControl<IntervalType>;
  stat: FormControl<MonitorStatType>;
  metric: FormControl<Metric>;
  channelGroup: FormControl<number>;
  triggers: FormArray<FormGroup<TriggerForm>>;
}
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

  INTERVAL_TYPES = INTERVAL_TYPES;
  MONITOR_STATS = MONITOR_STATS;
  VALUE_OPERATORS = VALUE_OPERATORS;
  NUM_CHANNELS_OPERATORS = NUM_CHANNELS_OPERATORS;

  selectedChannelGroup: ChannelGroup;
  selectedMetric: Metric;
  groups: any;
  monitorForm: FormGroup<MonitorForm> = this.formBuilder.group<MonitorForm>({
    name: new FormControl("", Validators.required),
    intervalCount: new FormControl(null, [
      Validators.required,
      Validators.min(1),
    ]),
    intervalType: new FormControl(null, Validators.required),
    stat: new FormControl(null, Validators.required),
    metric: new FormControl(null, Validators.required),
    channelGroup: new FormControl(null, Validators.required),
    triggers: this.formBuilder.array<FormGroup<TriggerForm>>([]),
  });

  constructor(
    private formBuilder: FormBuilder,
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
  get triggers(): FormArray<FormGroup<TriggerForm>> {
    return this.monitorForm.get("triggers") as FormArray<
      FormGroup<TriggerForm>
    >;
  }

  /**
   * Add a new trigger to the form
   *
   * @param trigger trigger to add, empty if blank form
   * @returns trigger form group
   */
  makeTriggerForm(trigger?: Trigger): FormGroup<TriggerForm> {
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
    const triggers = this.triggers.value as Trigger[];
    const monitor = new Monitor({
      id: this.id,
      name: values.name,
      channelGroupId: values.channelGroup,
      metricId: values.metric.id,
      intervalType: values.intervalType,
      intervalCount: values.intervalCount,
      stat: values.stat,
      triggers,
    });
    this.monitorService
      .updateOrCreate(monitor)
      .pipe(
        switchMap((monitorId: number) => {
          triggers.forEach((t) => {
            t.monitorId = monitorId;
          });
          return merge(
            ...this.triggerService.updateOrDelete(
              triggers,
              this.removeTriggerIDs
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
        (m) => m.id === this.monitor.metricId
      );

      this.monitorForm.patchValue({
        name: this.monitor.name,
        intervalCount: this.monitor.intervalCount,
        intervalType: this.monitor.intervalType,
        stat: this.monitor.stat,
        channelGroup: this.monitor.channelGroupId,
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
