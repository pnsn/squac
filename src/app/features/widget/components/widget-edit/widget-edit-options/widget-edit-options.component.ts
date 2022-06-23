import {
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  OnInit,
} from "@angular/core";
import { Threshold } from "@features/widget/models/threshold";
import { Metric } from "@core/models/metric";
import { WidgetConfigService } from "@features/widget/services/widget-config.service";
import { Subscription } from "rxjs";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as colormap from "colormap";
@Component({
  selector: "widget-edit-options",
  templateUrl: "./widget-edit-options.component.html",
  styleUrls: ["./widget-edit-options.component.scss"],
})
export class WidgetEditOptionsComponent
  implements OnChanges, OnDestroy, OnInit
{
  constructor(
    private widgetConfigService: WidgetConfigService,
    private formBuilder: FormBuilder
  ) {
    this.gradientOptions = this.widgetConfigService.gradientOptions;
    this.solidOptions = this.widgetConfigService.solidOptions;
    this.widgetTypes = this.widgetConfigService.widgetTypes;
  }
  @Input() selectedMetrics: Metric[];
  @Input() type: string;
  @Input() displayType: any;
  @Input() thresholds: Threshold[];
  @Output() thresholdsChange = new EventEmitter<Threshold[]>();
  @Input() properties: any;
  @Output() propertiesChange = new EventEmitter<any>();

  widgetTypes;
  widgetType;
  gradientOptions;
  solidOptions;
  subscriptions: Subscription = new Subscription();

  optionsForm: FormGroup = this.formBuilder.group({
    thresholdArray: this.formBuilder.array([]),
    dimensions: this.formBuilder.array([]),
    options: this.formBuilder.group({
      displayType: [""],
      inRange: [null],
      outOfRange: [null],
      numSplits: [null], //>0 not continuous
    }),
  });

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.thresholdArray.valueChanges.subscribe((values) => {
      if (this.thresholdArray.valid) {
        this.thresholdsChange.emit(values);
      }
    });
    this.optionsForm.get("options").valueChanges.subscribe((value) => {
      this.properties.numSplits = value.numSplits || 0;
      this.validateOptions();
      this.properties.inRange = value.inRange;
      this.properties.outOfRange = value.outOfRange;
      this.propertiesChange.emit(this.properties);
    });

    this.dimensions.valueChanges.subscribe((value) => {
      this.properties.dimensions = value;
      this.propertiesChange.emit(this.properties);
    });
  }

  validateOptions() {
    const numSplits = this.optionsForm.get("options").get("numSplits");
    if (this.properties.displayType === "stoplight") {
      this.properties.numSplits = 0;
      numSplits.patchValue(0, { emitEvent: false });
      numSplits.disable({ emitEvent: false });
    } else {
      numSplits.enable({ emitEvent: false });
    }
  }

  //what happens if you change widget type but don't change this
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.selectedMetrics && changes.selectedMetrics.previousValue) {
      this.changeMetrics();
    }

    if (changes.properties && changes.properties.currentValue) {
      if (!this.properties.dimensions) {
        this.properties.dimensions = [];
      }
    }

    if (changes.displayType) {
      this.updateDimensions();
    }

    if (changes.type) {
      this.widgetType = this.widgetTypes.find((type) => {
        return this.type === type.type;
      });
      this.initForm();
      if (!this.widgetType) {
        this.thresholds = [];
        this.thresholdArray.clear();
      }
      //update which display options available
    }

    if (
      changes.thresholds &&
      !changes.thresholds.previousValue &&
      this.thresholds
    ) {
      this.thresholds.forEach((threshold) => {
        this.addThreshold(threshold);
      });
    }
  }

  initForm() {
    this.optionsForm.get("options").patchValue(
      {
        inRange: this.properties.inRange
          ? this.findColor(this.properties.inRange.type)
          : this.findColor("redgreen"),
        outOfRange: this.properties.outOfRange
          ? this.findColor(this.properties.outOfRange.type)
          : this.findColor("white"),
        numSplits: this.properties.numSplits || 0,
      },
      { emitEvent: false }
    );
    if (this.thresholds.length === 0 && this.thresholdArray.length === 0) {
      this.addThreshold();
    }
  }

  //      threshold ? this.findColor(threshold.outOfRange.type) : null,
  //Validators.required,

  updateDimensions() {
    const selected = this.properties.dimensions;
    this.dimensions.clear();
    this.displayType?.dimensions?.forEach((dimension, i) => {
      const dim = selected.find((m) => {
        return dimension === m.type;
      });
      console.log("update dimensions");
      let metricId;
      if (dim) {
        metricId = dim.metricId;
      } else if (this.selectedMetrics[i]) {
        metricId = this.selectedMetrics[i]?.id;
      } else {
        metricId = this.selectedMetrics[0]?.id;
      }

      this.dimensions.push(
        this.formBuilder.group({
          type: [dimension], //default to piecewise
          metricId: [metricId],
        })
      );
    });
    this.properties.dimensions = this.dimensions.value;
  }

  //check if metrics removed
  changeMetrics() {
    const temp = this.properties.dimensions;

    //remove dimensions that don't have metrics
    this.properties.dimensions = temp.filter((dim) => {
      const index = this.selectedMetrics.findIndex(
        (m) => m.id === dim.metricId
      );
      return index >= 0;
    });
    this.updateDimensions();
  }

  makeThresholdForm(threshold?: Threshold) {
    return this.formBuilder.group({
      min: [threshold ? threshold.min : null],
      max: [threshold ? threshold.max : null],
      metrics: [threshold ? threshold.metrics : [], Validators.required],
    });
  }

  //find colors in options using the type
  findColor(type) {
    const t = [...this.gradientOptions, ...this.solidOptions].find((option) => {
      return option.type === type;
    });
    return t;
  }

  colors(option) {
    if (option.color) {
      return option.color;
    }
    if (option.type) {
      return colormap({
        colormap: option.type,
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get thresholdArray(): FormArray {
    return this.optionsForm.get("thresholdArray") as FormArray;
  }

  get dimensions(): FormArray {
    return this.optionsForm.get("dimensions") as FormArray;
  }

  // Add a new threshold
  addThreshold(threshold?: Threshold) {
    const thresholdFormGroup = this.makeThresholdForm(threshold);
    this.thresholdArray.push(thresholdFormGroup, { emitEvent: false });
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

// if (
//   this.widgetType &&
//   this.widgetType.dimensions &&
//   this.selectedMetrics.length > 0
// ) {
//   this.widgetType.dimensions.forEach((dimension, i) => {
//     const dim = selected.find((m) => {
//       return dimension === m.type;
//     });

//     let metricId;
//     if (dim) {
//       metricId = dim.metricId;
//     } else if (this.selectedMetrics[i]) {
//       metricId = this.selectedMetrics[i].id;
//     } else {
//       metricId = this.selectedMetrics[0].id;
//     }

//     this.dimensions.push(
//       this.formBuilder.group({
//         type: [dimension], //default to piecewise
//         metricId: [metricId],
//       })
//     );
//   });
// }

//  d
