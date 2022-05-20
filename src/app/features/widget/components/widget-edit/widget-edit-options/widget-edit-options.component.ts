import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from "@angular/core";
import { Threshold } from "@features/widget/models/threshold";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { Metric } from "@core/models/metric";
import { WidgetConfigService } from "@features/widget/services/widget-config.service";
import { Subscription } from "rxjs";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: "widget-edit-options",
  templateUrl: "./widget-edit-options.component.html",
  styleUrls: ["./widget-edit-options.component.scss"],
})
export class WidgetEditOptionsComponent implements OnChanges, OnDestroy {
  constructor(
    private widgetConfigService: WidgetConfigService,
    private formBuilder: FormBuilder
  ) {
    this.inRangeOptions = this.widgetConfigService.inRangeOptions;
    this.outOfRangeOptions = this.widgetConfigService.outOfRangeOptions;
  }
  @Input() selectedMetrics: Metric[];
  @Input() widgetType: string;
  @Input() thresholds: Threshold[];
  @Output() thresholdsChange = new EventEmitter<Threshold[]>();
  @Input() properties: any;
  @Output() propertiesChange = new EventEmitter<any>();

  inRangeOptions;
  outOfRangeOptions;
  subscriptions: Subscription = new Subscription();

  thresholdsForm: FormGroup = this.formBuilder.group({
    thresholdArray: this.formBuilder.array([]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.selectedMetrics) {
    }

    if (changes.widgetType) {
    }

    if (changes.thresholds && changes.thresholds.currentValue) {
      this.thresholds.forEach((threshold) => {
        this.addThreshold(threshold);
      });
      if (this.thresholds.length === 0) {
        this.addThreshold();
      }
    }

    if (changes.properties && changes.properties.currentValue) {
    }
  }

  gradient(color: Array<string>) {
    return "linear-gradient(" + color.toString + ")";
  }

  //todo this should be in child component, avoid type specific in detail
  expectedMetrics(): number {
    let numMetrics;
    if (this.widgetType === "scatter-plot") {
      numMetrics = 3;
    } else if (
      this.widgetType === "parallel-plot" ||
      this.widgetType === "tabular"
    ) {
      numMetrics = this.selectedMetrics.length;
    } else {
      numMetrics = 1;
    }
    return numMetrics;
  }

  // type: string; //continuous, piecewise, markLine, markArea
  // min: number;
  // max: number;
  // inRange: {
  //   color: string[];
  // };
  // outOfRange: {
  //   color: string[];
  // };
  // data: [];
  // Add threshold info to form
  makeThresholdForm(threshold?: Threshold) {
    return this.formBuilder.group({
      type: [threshold ? threshold.type : "piecewise"], //default to piecewise
      min: [threshold ? threshold.min : null],
      max: [threshold ? threshold.max : null],
      inRange: [threshold ? threshold.inRange : null],
      outOfRange: [threshold ? threshold.outOfRange : null],
      metrics: [threshold ? threshold.metrics : []],
      numSplits: [threshold ? threshold.numSplits : 5],
      reverseColors: [threshold ? threshold.reverseColors : false],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get thresholdArray(): FormArray {
    return this.thresholdsForm.get("thresholdArray") as FormArray;
  }

  // Add a new threshold
  addThreshold(threshold?: Threshold) {
    const thresholdFormGroup = this.makeThresholdForm(threshold);
    // thresholdFormGroup.valueChanges.subscribe((value) =>
    //   this.validateThreshold(value, thresholdFormGroup)
    // );
    this.thresholdArray.push(thresholdFormGroup);
  }

  updateDisplayOptions() {
    // this.widgetEditService.updateWidgetProperties(this.thresholdsForm.value);
  }

  // Remove given threshold
  removeThreshold(index) {
    this.thresholdArray.removeAt(index);
  }

  getMetric(metricId: number) {
    const metric = this.selectedMetrics?.find((metric) => {
      return metric.id === +metricId;
    });
    return metric?.name;
  }
}
