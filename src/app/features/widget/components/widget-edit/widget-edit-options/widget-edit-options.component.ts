import { Component, OnInit, OnDestroy } from "@angular/core";
import { Threshold } from "@features/widget/models/threshold";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { Metric } from "@core/models/metric";
import { WidgetEditService } from "@features/widget/services/widget-edit.service";
import { Subscription } from "rxjs";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: "widget-edit-options",
  templateUrl: "./widget-edit-options.component.html",
  styleUrls: ["./widget-edit-options.component.scss"],
})
export class WidgetEditOptionsComponent implements OnInit, OnDestroy {
  constructor(
    private widgetEditService: WidgetEditService,
    private formBuilder: FormBuilder
  ) {}
  selectedMetrics: Metric[];
  editing = {};
  subscriptions: Subscription = new Subscription();

  thresholdsForm: FormGroup = this.formBuilder.group({
    thresholds: this.formBuilder.array([]),
  });

  widgetType: string;

  inRangeOptions: any[] = [
    {
      color: ["#336178"],
      label: "solid blue",
    },
    {
      color: ["#ff950a"],
      label: "solid yellow",
    },
    {
      color: ["white"],
      label: "solid white",
    },
    {
      color: ["black"],
      label: "solid black",
    },
    {
      color: ["gray"],
      label: "solid gray",
    },
    {
      label: "Rainbow",
      color: ["purple", "blue", "cyan", "green", "yellow", "orange", "red"],
    },
    {
      label: "Jet",
      color: ["blue", "cyan", "white", "yellow", "red"],
    },
    {
      label: "Polar",
      color: ["blue", "white", "red"],
    },
    {
      label: "Hot",
      color: ["black", "red", "orange", "yellow", "white"],
    },
    {
      label: "Red to Green",
      color: ["red", "white", "green"],
    },
    {
      label: "Ocean",
      color: ["black", "blue", "cyan", "white"],
    },
    {
      label: "Cool",
      color: ["cyan", "blue", "purple"],
    },
    {
      label: "Split",
      color: ["blue", "black", "red"],
    },
    {
      label: "Gray",
      color: ["black", "gray", "white"],
    },
    {
      label: "Seis",
      color: ["red", "orange", "yellow", "green", "blue"],
    },
  ];
  outOfRangeOptions = [
    {
      color: ["#336178"],
      label: "blue",
    },
    {
      color: ["#ff950a"],
      label: "yellow",
    },
    {
      color: ["white"],
      label: "white",
    },
    {
      color: ["black"],
      label: "black",
    },
    {
      color: ["gray"],
      label: "gray",
    },
  ];
  ngOnInit() {
    const sub = this.widgetEditService.selectedMetrics.subscribe({
      next: (metrics) => {
        this.selectedMetrics = metrics;
      },
      error: (error) => {
        console.log("error in threshold edit: " + error);
      },
    });
    const typeSub = this.widgetEditService.selectedType.subscribe({
      next: (type) => {
        this.widgetType = type;
        this.expectedMetrics();
      },
    });
    const thresholds = this.widgetEditService.thresholds;

    thresholds.forEach((threshold) => {
      this.addThreshold(threshold);
    });
    if (thresholds.length === 0) {
      this.addThreshold();
    }
    this.subscriptions.add(sub);
    this.subscriptions.add(typeSub);
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

  updateDisplayOptions() {
    this.widgetEditService.updateWidgetProperties(this.thresholdsForm.value);
  }

  // Remove given threshold
  removeThreshold(index) {
    this.thresholds.removeAt(index);
  }

  getMetric(metricId: number) {
    const metric = this.selectedMetrics.find((metric) => {
      return metric.id === +metricId;
    });
    return metric?.name;
  }
}
