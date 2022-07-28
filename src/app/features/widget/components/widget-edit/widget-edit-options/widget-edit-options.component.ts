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
  subscriptions: Subscription = new Subscription();
  @Input() selectedMetrics: Metric[];
  @Input() type: string;
  @Input() displayType: any;
  @Input() thresholds: Threshold[];
  @Output() thresholdsChange = new EventEmitter<Threshold[]>();
  @Input() properties: any;
  @Output() propertiesChange = new EventEmitter<any>();

  widgetTypes: any;
  widgetType: any;
  gradientOptions: any[];
  solidOptions: any[];

  optionsForm: FormGroup = this.formBuilder.group({
    thresholdArray: this.formBuilder.array([]),
    dimensions: this.formBuilder.array([]),
    options: this.formBuilder.group({
      inRange: [null],
      outOfRange: [null],
      numSplits: [null, { validators: [Validators.min(0)] }], //>0 not continuous
      reverseColors: false,
    }),
  });

  constructor(
    widgetConfigService: WidgetConfigService,
    private formBuilder: FormBuilder
  ) {
    this.gradientOptions = widgetConfigService.gradientOptions;
    this.solidOptions = widgetConfigService.solidOptions;
    this.widgetTypes = widgetConfigService.widgetTypes;
  }

  ngOnInit(): void {
    this.thresholdArray.valueChanges.subscribe((values) => {
      this.thresholds = values;
      if (this.thresholdArray.valid) {
        this.thresholdsChange.emit(values);
      }
    });
    this.optionsForm.get("options").valueChanges.subscribe((value) => {
      this.properties.numSplits = value.numSplits || 0;
      this.validateOptions();
      this.properties.inRange = value.inRange;
      this.properties.outOfRange = value.outOfRange;
      this.properties.reverseColors = value.reverseColors;
      this.propertiesChange.emit(this.properties);
    });

    this.dimensions.valueChanges.subscribe((value) => {
      this.properties.dimensions = value;
      this.propertiesChange.emit(this.properties);
    });

    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedMetrics) {
      this.thresholdArray.clear({ emitEvent: false });
      this.changeMetrics();
      this.updateDimensions();
    }

    if (changes.properties && changes.properties.currentValue) {
      if (!this.properties.dimensions) {
        this.properties.dimensions = [];
      }
    }

    if (changes.displayType) {
      this.updateDimensions();
      this.validateOptions();
    }

    if (changes.type) {
      this.widgetType = this.widgetTypes.find((type) => {
        return this.type === type.type;
      });
      if (!this.widgetType) {
        this.thresholds = [];
        this.thresholdArray.clear();
      }
      //update which display options available
    }
  }

  // check form inputs
  validateOptions(): void {
    const numSplits = this.optionsForm.get("options").get("numSplits");
    if (this.properties.displayType === "stoplight") {
      this.properties.numSplits = 0;
      numSplits.patchValue(0, { emitEvent: false });
      numSplits.disable({ emitEvent: false });
    } else {
      numSplits.enable({ emitEvent: false });
    }
  }

  // set up form
  initForm(): void {
    const inColors = this.findColor(this.properties.inRange?.type);

    this.optionsForm.get("options").patchValue(
      {
        inRange: inColors || this.findColor("rainbow"),
        outOfRange: this.properties.outOfRange
          ? this.findColor(this.properties.outOfRange.type)
          : this.findColor("solid-gray"),
        numSplits: this.properties.numSplits || 0,
        reverseColors: this.properties.reverseColors,
      },
      { emitEvent: true }
    );
  }

  // match dimensions on widget to selected metrics
  updateDimensions() {
    const selected = this.properties.dimensions;
    this.dimensions.clear();
    this.displayType?.dimensions?.forEach((dimension, i) => {
      const dim = selected.find((m) => {
        return dimension === m.type;
      });
      let metricId;
      if (dim && dim.metricId) {
        metricId = dim.metricId;
      } else if (this.selectedMetrics && this.selectedMetrics[i]) {
        metricId = this.selectedMetrics[i]?.id;
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
    if (this.selectedMetrics && this.selectedMetrics.length > 0) {
      //remove dimensions that don't have metrics
      this.properties.dimensions = temp?.filter((dim) => {
        const index = this.selectedMetrics.findIndex(
          (m) => m.id === dim.metricId
        );
        return index >= 0;
      });
      this.selectedMetrics.forEach((metric) => {
        const threshold = this.thresholds.find((threshold) => {
          return metric.id === threshold.metricId;
        });
        if (threshold) {
          this.addThreshold(threshold);
        } else {
          this.addThreshold({
            metricId: metric.id,
            min: metric.minVal,
            max: metric.maxVal,
          });
        }
      });
    }

    this.updateDimensions();
  }

  // populate form
  makeThresholdForm(threshold?: Threshold) {
    return this.formBuilder.group({
      min: [threshold ? threshold.min : null],
      max: [threshold ? threshold.max : null],
      metricId: [threshold ? threshold.metricId : null, Validators.required],
    });
  }

  //find colors in options using the type
  findColor(type: any): any {
    const t = [...this.gradientOptions, ...this.solidOptions].find((option) => {
      return option.type === type;
    });
    return t;
  }

  // get color from color option
  colors(option: any): string[] {
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
    this.thresholdArray.push(thresholdFormGroup, { emitEvent: true });
  }

  // Remove given threshold
  removeThreshold(index) {
    this.thresholdArray.at(index).patchValue({
      min: null,
      max: null,
    });
  }

  // return metric name
  getMetricName(metricId: number) {
    const metric = this.selectedMetrics?.find((metric) => {
      return metric.id === +metricId;
    });
    return metric?.name;
  }
}
