import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Metric } from "@core/models/metric";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { MetricService } from "@metric/services/metric.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "widget-edit-metrics",
  templateUrl: "./metric-edit.component.html",
  styleUrls: ["./metric-edit.component.scss"],
})
export class MetricEditComponent implements OnInit, OnDestroy {
  id: number;
  metric: Metric;
  editMode: boolean;
  metricForm: FormGroup = this.formBuilder.group({
    name: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    code: new FormControl("", Validators.required),
    refUrl: new FormControl("", Validators.required),
    unit: new FormControl("", Validators.required),
    sampleRate: new FormControl("", Validators.required),
    minVal: new FormControl(""),
    maxVal: new FormControl(""),
  });
  subscriptions: Subscription = new Subscription();
  constructor(
    private metricService: MetricService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MetricEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.metric = this.data.metric;
    this.editMode = !!this.metric;
    this.initForm();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initForm() {
    if (this.editMode) {
      this.metricForm.patchValue({
        name: this.metric.name,
        code: this.metric.code,
        description: this.metric.description,
        refUrl: this.metric.refUrl,
        unit: this.metric.unit,
        sampleRate: this.metric.sampleRate,
        minVal: this.metric.minVal,
        maxVal: this.metric.maxVal,
      });
    }
  }
  // Save channel information
  save() {
    const values = this.metricForm.value;
    this.metricService
      .updateMetric(
        new Metric(
          this.id,
          null,
          values.name,
          values.code,
          values.description,
          values.refUrl,
          values.unit,
          values.sampleRate,
          values.minVal,
          values.maxVal
        )
      )
      .subscribe({
        next: (result) => {
          console.log("done");
          this.cancel(result.id);
        },
        error: (error) => {
          console.log("error in save metric: " + error);
        },
      });
  }

  cancel(metricId?: number) {
    this.dialogRef.close(metricId);
    // route out of edit
  }

  // Check if form has unsaved fields
  formUnsaved(e: Event) {
    e.preventDefault();
    // if (this.metricForm.dirty) {
    //   this.confirmDialog.open({
    //     title: "Cancel editing",
    //     message: "You have unsaved changes, if you cancel they will be lost.",
    //     cancelText: "Keep editing",
    //     confirmText: "Cancel",
    //   });
    //   this.confirmDialog.confirmed().subscribe((confirm) => {
    //     if (confirm) {
    //       this.cancel();
    //     }
    //   });
    // } else {
    //   this.cancel();
    // }
  }
}
