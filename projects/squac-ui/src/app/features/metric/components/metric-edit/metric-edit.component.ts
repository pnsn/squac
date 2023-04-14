import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Metric } from "squacapi";
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { MetricService } from "squacapi";
import { Subscription } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

/** Metric edit form contrils */
interface MetricForm {
  /** metric name */
  name: FormControl<string>;
  /** metric description */
  description: FormControl<string>;
  /** metric id code */
  code: FormControl<string>;
  /** metric link to more info */
  referenceUrl: FormControl<string>;
  /** unit for measurements for this metric */
  unit: FormControl<string>;
  /** metric sample rate */
  sampleRate: FormControl<number>;
  /** default minimum value of metric, used for display */
  minVal: FormControl<number>;
  /** default maximum value of metric, used for display */
  maxVal: FormControl<number>;
}
/**
 * Component for editing metric information
 */
@Component({
  selector: "widget-edit-metrics",
  templateUrl: "./metric-edit.component.html",
  styleUrls: ["./metric-edit.component.scss"],
})
export class MetricEditComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  id: number;
  metric: Metric;
  editMode: boolean;

  metricForm: FormGroup<MetricForm> = this.formBuilder.group({
    name: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    code: new FormControl("", Validators.required),
    referenceUrl: new FormControl("", Validators.required),
    unit: new FormControl("", Validators.required),
    sampleRate: new FormControl(null, Validators.required),
    minVal: new FormControl(),
    maxVal: new FormControl(),
  });

  constructor(
    private metricService: MetricService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MetricEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /** Set initial info */
  ngOnInit(): void {
    this.metric = this.data["metric"];
    this.editMode = !!this.metric;
    this.initForm();
  }

  /** populate form */
  initForm(): void {
    if (this.editMode) {
      this.metricForm.patchValue({
        name: this.metric.name,
        code: this.metric.code,
        description: this.metric.description,
        referenceUrl: this.metric.referenceUrl,
        unit: this.metric.unit,
        sampleRate: this.metric.sampleRate,
        minVal: this.metric.minVal,
        maxVal: this.metric.maxVal,
      });
    }
  }

  /** Saves metric information */
  save(): void {
    const values = this.metricForm.value;
    const metric = new Metric({
      id: this.id,
      name: values.name,
      code: values.code,
      description: values.description,
      unit: values.unit,
      referenceUrl: values.referenceUrl,
      sampleRate: values.sampleRate,
      minVal: values.minVal,
      maxVal: values.maxVal,
    });
    this.metricService.updateOrCreate(metric).subscribe({
      next: (metricId) => {
        this.cancel(metricId);
      },
    });
  }

  /**
   * Cancels editing without saving
   *
   * @param metricId metric id
   */
  cancel(metricId?: number): void {
    this.dialogRef.close(metricId);
  }

  /** unsubscribe */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
