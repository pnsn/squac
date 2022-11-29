import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import * as colormap from "colormap";
import { Subscription } from "rxjs";
import { Metric, Threshold, WidgetProperties } from "squacapi";
import {
  WidgetConfig,
  WidgetDisplayOption,
  WidgetType,
  WIDGET_GRADIENT_COLORS,
  WIDGET_SOLID_COLORS,
  WIDGET_TYPE_INFO,
} from "widgets";

interface ThresholdForm {
  dimension?: FormControl<string>;
  min: FormControl<number>;
  max: FormControl<number>;
  metricId: FormControl<number>;
}
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
  @Input() type: WidgetType;
  @Input() displayType: string;
  @Input() thresholds: Threshold[];
  @Output() thresholdsChange = new EventEmitter<Threshold[]>();
  @Input() properties: WidgetProperties;
  @Output() propertiesChange = new EventEmitter<any>();

  widgetConfig: WidgetConfig;
  WidgetTypeInfo = WIDGET_TYPE_INFO;
  displayOption: WidgetDisplayOption;
  gradientOptions: any[];
  solidOptions: any[];

  optionsForm: UntypedFormGroup = this.formBuilder.group({
    thresholdArray: this.formBuilder.array<FormGroup<ThresholdForm>>([]),
    options: this.formBuilder.group({
      inRange: [null],
      outOfRange: [null],
      numSplits: [null, { validators: [Validators.min(0)] }], //>0 not continuous
      reverseColors: false,
    }),
  });

  constructor(private formBuilder: FormBuilder) {
    this.gradientOptions = WIDGET_GRADIENT_COLORS;
    this.solidOptions = WIDGET_SOLID_COLORS;
  }

  ngOnInit(): void {
    this.thresholdArray.valueChanges.subscribe((values) => {
      // this.validateThresholds();
      this.thresholds = values as Threshold[];
      if (this.thresholdArray.valid) {
        this.thresholdsChange.emit(this.thresholds);
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

    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["selectedMetrics"]) {
      this.thresholdArray.clear({ emitEvent: false });
      this.changeMetrics();
    }

    if (changes["type"] && this.type) {
      this.widgetConfig = this.WidgetTypeInfo[this.type].config;
      if (!this.widgetConfig) {
        this.thresholds = [];
        this.thresholdArray.clear();
      }
      this.validateOptions();
      this.validateThresholds();
      //update which display options available
    }

    if (changes["displayType"] && !changes["displayType"]) {
      this.validateOptions();
      this.validateThresholds();
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
    let inColors;
    if (this.properties.inRange) {
      inColors = this.findColor(this.properties.inRange?.type);
    }
    this.optionsForm.get("options").patchValue(
      {
        inRange: inColors || this.findColor("rainbow"),
        outOfRange: this.properties.outOfRange
          ? this.findColor(this.properties.outOfRange.type)
          : this.findColor("solid-gray"),
        numSplits: this.properties.numSplits || 0,
        reverseColors: this.properties.reverseColors || false,
      },
      { emitEvent: true }
    );
  }

  validateThresholds(index?: number): void {
    const thresholds = this.thresholdArray.controls;
    let dimensions = [];
    if (
      this.displayType &&
      this.widgetConfig &&
      this.widgetConfig.displayOptions[this.displayType]
    ) {
      this.displayOption = this.widgetConfig.displayOptions[this.displayType];
      if (this.displayOption.dimensions) {
        dimensions = [...this.displayOption.dimensions];
      }
    }

    const lastDimension = index ? thresholds[index].value.dimension : null;

    thresholds.forEach((threshold, i) => {
      const dimension = threshold.value.dimension;

      if (dimension) {
        //skip most recently changed
        const dimIndex = dimensions.indexOf(dimension);
        // dimension taken
        if ((dimIndex > -1 && dimension !== lastDimension) || i === index) {
          dimensions.splice(dimIndex, 1);
        } else {
          //remove dimension from threshold
          threshold.patchValue(
            {
              dimension: null,
            },
            { emitEvent: true }
          );
        }
      }
    });

    // assign remaining dimensions to other thresholds
    thresholds.forEach((threshold) => {
      if (!threshold.value.dimension && dimensions.length > 0) {
        threshold.patchValue(
          {
            dimension: dimensions[0],
          },
          { emitEvent: true }
        );

        dimensions.splice(0, 1);
      }
    });
  }

  //check if metrics removed
  changeMetrics(): void {
    if (this.selectedMetrics && this.selectedMetrics.length > 0) {
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
      this.validateThresholds(0);
      this.thresholds = this.thresholdArray.value as Threshold[];
      this.thresholdsChange.emit(this.thresholds);
    }
  }

  // populate form
  makeThresholdForm(threshold?: Threshold): FormGroup<ThresholdForm> {
    return this.formBuilder.group<ThresholdForm>({
      dimension: new FormControl(threshold ? threshold.dimension : null),
      min: new FormControl(threshold ? threshold.min : null),
      max: new FormControl(threshold ? threshold.max : null),
      metricId: new FormControl(threshold ? threshold.metricId : null, [
        Validators.required,
      ]),
    });
  }

  //find colors in options using the type
  findColor(type: string): any {
    const t = [...this.gradientOptions, ...this.solidOptions].find((option) => {
      return option.type === type;
    });
    return t;
  }

  // get color from color option
  colors(option: any): string[] | void {
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

  get thresholdArray(): FormArray<FormGroup<ThresholdForm>> {
    return this.optionsForm.controls["thresholdArray"] as FormArray;
  }

  // Add a new threshold
  addThreshold(threshold?: Threshold): void {
    const thresholdFormGroup = this.makeThresholdForm(threshold);
    this.thresholdArray.push(thresholdFormGroup, { emitEvent: true });
  }

  // return metric name
  getMetricName(metricId: number): string {
    const metric = this.selectedMetrics?.find((metric) => {
      return metric.id === +metricId;
    });
    return metric?.name;
  }
}
