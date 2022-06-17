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
      this.properties.displayType = value.displayType;
      this.properties.numSplits = value.numSplits || 0;
      this.validateOptions();
      this.updateDimensions();
      this.properties.inRange = value.inRange;
      this.properties.outOfRange = value.outOfRange;
      this.propertiesChange.emit(this.properties);
    });

    this.dimensions.valueChanges.subscribe((value) => {
      console.log(value);
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
    if (changes.selectedMetrics) {
      //cleanup old settings
    }

    if (changes.properties && changes.properties.currentValue) {
      if (!this.properties.dimensions) {
        this.properties.dimensions = [];
      }
    }

    if (changes.type) {
      this.widgetType = this.widgetTypes.find((type) => {
        return this.type === type.type;
      });
      this.initForm();
      if (!this.widgetType || !this.widgetType.displayOptions) {
        console.log("no thresholds allowed");
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
      if (this.thresholds.length === 0) {
        this.addThreshold();
      }
    }
  }

  //      threshold ? this.findColor(threshold.outOfRange.type) : null,
  //Validators.required,

  updateDimensions() {
    let displayType;
    if (this.widgetType?.displayOptions) {
      const type = this.properties.displayType;
      displayType = this.widgetType.displayOptions.find(
        (option) => option.displayType === type
      );

      displayType = displayType || this.widgetType.displayOptions[0];

      const selected = this.properties.dimensions;
      this.dimensions.clear();

      if (displayType) {
        this.properties.displayType = displayType.displayType;
        displayType.dimensions?.forEach((dimension, i) => {
          const dim = selected.find((m) => {
            return dimension === m.type;
          });

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
      }
    }
  }
  initForm() {
    this.properties.dimensions = [];
    this.properties.displayType = null;
    if (this.widgetType && this.widgetType.displayOptions) {
      this.updateDimensions();
    }
    this.optionsForm.get("options").patchValue(
      {
        inRange: this.properties.inRange
          ? this.findColor(this.properties.inRange.type)
          : null,
        outOfRange: this.properties.outOfRange
          ? this.findColor(this.properties.outOfRange.type)
          : null,
        displayType: this.properties.displayType,
        numSplits: this.properties.numSplits,
      },
      { emitEvent: false }
    );
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
