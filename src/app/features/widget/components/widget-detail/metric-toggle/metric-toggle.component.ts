import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { WidgetDisplayOption } from "@features/widget/models/widget-type";
import { Metric } from "@squacapi/models/metric";
import { Threshold } from "@squacapi/models/threshold";

@Component({
  selector: "widget-metric-toggle",
  templateUrl: "./metric-toggle.component.html",
  styleUrls: ["./metric-toggle.component.scss"],
})
export class MetricToggleComponent implements OnChanges {
  selected: number[] = [];
  @Input() expectedMetrics: number;
  metricsChanged = false;
  availableDimensions = [];
  @Input() dimensions: any;

  @Input() initialMetrics: Metric[];
  @Input() thresholds: Threshold[];
  @Output() thresholdsChange = new EventEmitter();
  @Output() metricsChange = new EventEmitter();

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    this.selectMetrics();
  }

  getSelectedIndex(id: number): number {
    return this.selected.indexOf(id);
  }
  getMetric(id: number): Metric {
    return this.initialMetrics.find((m) => {
      return m.id === id;
    });
  }

  // populate selected metrics
  selectMetrics(): void {
    this.selected = [];

    if (this.dimensions) {
      this.availableDimensions = [...this.dimensions];

      // get metrics that match thresholds & check dimensions
      for (let i = 0; i < this.thresholds.length; i++) {
        const threshold = this.thresholds[i];
        if (threshold.dimension) {
          const metricIndex = this.initialMetrics.findIndex(
            (m) => m.id === threshold.metricId
          );
          if (metricIndex === -1) {
            //check if widget has metric
            this.thresholds.splice(i, 1);
          } else {
            this.selected.push(threshold.metricId);
            const index = this.availableDimensions.indexOf(threshold.dimension);
            if (index > -1) {
              this.availableDimensions.splice(index, 1);
            } else {
              threshold.dimension = null;
            }
          }
        }
      }

      // if enough not enough dimensions, update with remaining metrics;
      if (this.selected.length < this.expectedMetrics) {
        this.initialMetrics.forEach((metric: Metric, _index) => {
          if (
            this.selected.indexOf(metric.id) < 0 &&
            this.availableDimensions.length > 0
          ) {
            this.thresholds.push({
              metricId: metric.id,
              min: metric.minVal,
              max: metric.maxVal,
              dimension: this.availableDimensions[0],
            });
            this.selected.push(metric.id);
            this.availableDimensions.splice(0, 1);
          }
        });
      }
    } else {
      // for widgets with no dimensions, show all as selected;
      this.selected = this.initialMetrics.map((metric) => metric.id);
    }

    this.metricsSelected();
  }

  // get new data and save metrics when changed
  metricsSelected(): void {
    let selectedMetrics = [];
    if (this.initialMetrics && this.expectedMetrics) {
      while (this.selected.length < this.expectedMetrics) {
        this.selected.push(this.initialMetrics[0].id);
      }
      const diff = this.expectedMetrics - this.selected.length;
      //if not enough metrics, populate with 1st one to prevent breaking
      this.selected.fill(
        this.initialMetrics[0].id,
        this.selected.length - 1,
        diff + this.selected.length - 1
      );
    }

    // add all selected metrics
    if (
      this.selected.length >= this.expectedMetrics ||
      (!this.dimensions && this.selected.length > 0)
    ) {
      // this.selectedMetrics = this.initialMetrics.filter(
      //   (metric) => this.selected.indexOf(metric.id) > -1
      // );

      selectedMetrics = this.selected.map((metricId) => {
        return this.initialMetrics.find((m) => m.id === metricId);
      });
      this.metricsChanged = false;
    }
    //order is getting reset by this
    // get new data
    this.metricsChange.emit(selectedMetrics);
  }

  //97: decrequest
  //94 hourly bp
  //83 hourly max

  //x-axis, y-axis, color

  // change dimension for metric
  changeThreshold(
    $event,
    threshold: Threshold,
    selectedIndex: number,
    metric
  ): void {
    $event.stopPropagation();
    if (selectedIndex === -1) {
      //not currently selected;
      if (this.availableDimensions.length === 0 && this.dimensions) {
        //remove dimension from other metrics
        threshold.dimension = this.dimensions[0];
        this.thresholds.forEach((t) => {
          if (
            t.dimension === threshold.dimension &&
            t.metricId !== threshold.metricId
          ) {
            t.dimension = null;
            const index = this.selected.indexOf(t.metricId);
            this.selected[index] = threshold.metricId;
          }
        });
      } else if (this.dimensions) {
        // put in correct spot
        threshold.dimension = this.availableDimensions[0];
        this.availableDimensions.splice(0, 1);

        this.dimensions.forEach((dim, i) => {
          if (dim === threshold.dimension) {
            this.selected[i] = threshold.metricId;
          }
        });
      } else {
        //put in first available spot
        let metricSet = false;

        this.selected = this.selected.map((s) => {
          if (s || metricSet) {
            return s;
          } else if (!metricSet && !s) {
            metricSet = true;
            return metric.id;
          }
        });
        if (this.selected.length === 0) {
          this.selected.push(metric.id);
        }
      }
    } else {
      // already selected, remove dimension
      if (this.dimensions) {
        const dim = threshold.dimension;
        threshold.dimension = null;
        this.availableDimensions.push(dim);
      }
      this.selected.splice(selectedIndex, 1);
    }

    this.metricsChanged =
      this.selected.length > 0 && this.availableDimensions.length === 0;
  }
}
