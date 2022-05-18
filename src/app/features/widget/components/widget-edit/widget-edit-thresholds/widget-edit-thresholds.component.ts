import { Component, OnInit, OnDestroy } from "@angular/core";
import { Threshold } from "@widget/models/threshold";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { Metric } from "@core/models/metric";
import { WidgetEditService } from "@widget/services/widget-edit.service";
import { Subscription } from "rxjs";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: "widget-edit-thresholds",
  templateUrl: "./widget-edit-thresholds.component.html",
  styleUrls: ["./widget-edit-thresholds.component.scss"],
})
export class WidgetEditThresholdsComponent implements OnInit, OnDestroy {
  constructor(
    private widgetEditService: WidgetEditService,
    private formBuilder: FormBuilder
  ) {}
  metrics: Metric[];
  editing = {};

  removeThresholdIds = [];

  subscriptions: Subscription = new Subscription();

  thresholdsForm: FormGroup = this.formBuilder.group({
    thresholds: this.formBuilder.array([]),
  });

  ngOnInit() {
    const sub = this.widgetEditService.selectedMetrics.subscribe({
      next: (metrics) => {
        this.metrics = metrics;
      },
      error: (error) => {
        console.log("error in threshold edit: " + error);
      },
    });
    this.subscriptions.add(sub);
  }

  // Add threshold info to form
  makeThresholdForm(threshold?: Threshold) {
    return this.formBuilder.group({
      min: [threshold ? threshold.min : null],
      max: [threshold ? threshold.max : null],
      id: [threshold ? threshold.id : null],
      metric: [threshold ? threshold.metricId : null],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get thresholds(): FormArray {
    return this.thresholdsForm.get("thresholds") as FormArray;
  }

  // Add a new threshold
  addThreshold(threshold?: Threshold) {
    const thresholdFormGroup = this.makeThresholdForm(threshold);
    // thresholdFormGroup.valueChanges.subscribe((value) =>
    //   this.validateThreshold(value, thresholdFormGroup)
    // );
    this.thresholds.push(thresholdFormGroup);
  }

  // Remove given threshold
  removeThreshold(index) {
    const threshold = this.thresholds.at(index).value;
    if (threshold.id) {
      this.removeThresholdIds.push(+threshold.id);
    }
    this.thresholds.removeAt(index);
  }

  getMetric(metricId: number) {
    return this.metrics.filter((metric) => {
      return metric.id === +metricId;
    })[0].name;
  }
}
