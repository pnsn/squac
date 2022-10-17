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
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import * as colormap from "colormap";
import { WidgetProperties } from "@features/widget/models/widget";
import {
  WidgetDisplayOption,
  WidgetType,
} from "@features/widget/models/widget-type";
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
  @Input() displayType: WidgetDisplayOption;
  @Input() thresholds: Threshold[];
  @Output() thresholdsChange = new EventEmitter<Threshold[]>();
  @Input() properties: WidgetProperties;
  @Output() propertiesChange = new EventEmitter<any>();

  widgetTypes: WidgetType[];
  widgetType: WidgetType;
  gradientOptions: any[];
  solidOptions: any[];

  optionsForm: UntypedFormGroup = this.formBuilder.group({
    thresholdArray: this.formBuilder.array([]),
    options: this.formBuilder.group({
      inRange: [null],
      outOfRange: [null],
      numSplits: [null, { validators: [Validators.min(0)] }], //>0 not continuous
      reverseColors: false,
    }),
  });

  constructor(
    widgetConfigService: WidgetConfigService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.gradientOptions = widgetConfigService.gradientOptions;
    this.solidOptions = widgetConfigService.solidOptions;
    this.widgetTypes = widgetConfigService.widgetTypes;
  }

  ngOnInit(): void {
    this.thresholdArray.valueChanges.subscribe((values) => {
      // this.validateThresholds();
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

    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedMetrics) {
      this.thresholdArray.clear({ emitEvent: false });
      this.changeMetrics();
    }

    if (changes.displayType) {
      this.validateOptions();
      this.validateThresholds();
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

  validateThresholds(index?: number) {
    const thresholds = this.thresholdArray.controls;
    let dimensions = [];

    if (this.displayType?.dimensions) {
      dimensions = [...this.displayType.dimensions];
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
  changeMetrics() {
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
      this.thresholds = this.thresholdArray.value;
      this.thresholdsChange.emit(this.thresholds);
    }
  }

  // populate form
  makeThresholdForm(threshold?: Threshold) {
    return this.formBuilder.group({
      dimension: [threshold ? threshold.dimension : null],
      min: [threshold ? threshold.min : null],
      max: [threshold ? threshold.max : null],
      metricId: [threshold ? threshold.metricId : null, Validators.required],
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

  get thresholdArray(): UntypedFormArray {
    return this.optionsForm.get("thresholdArray") as UntypedFormArray;
  }

  // Add a new threshold
  addThreshold(threshold?: Threshold) {
    const thresholdFormGroup = this.makeThresholdForm(threshold);
    this.thresholdArray.push(thresholdFormGroup, { emitEvent: true });
  }

  // return metric name
  getMetricName(metricId: number) {
    const metric = this.selectedMetrics?.find((metric) => {
      return metric.id === +metricId;
    });
    return metric?.name;
  }
}
