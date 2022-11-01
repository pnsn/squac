import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { Metric } from "@squacapi/models/metric";
import { Threshold } from "@squacapi/models/threshold";

@Component({
  selector: "widget-metric-toggle",
  templateUrl: "./metric-toggle.component.html",
  styleUrls: ["../widget-detail.component.scss"],
})
export class MetricToggleComponent implements OnChanges {
  selectedMetricIds: number[] = [];
  @Input() expectedMetrics: number;
  metricsChanged = false;
  availableDimensions = [];
  @Input() dimensions: any;

  @Input() initialMetrics: Metric[];
  @Input() thresholds: Threshold[];
  @Output() thresholdsChange = new EventEmitter();
  @Output() metricsChange = new EventEmitter();

  ngOnChanges() {
    this.selectMetrics();
  }

  /**
   * Find index of metric in selected metrics
   * @param id - id of metric
   * @returns - index of metric
   */
  getSelectedIndex(id: number): number {
    return this.selectedMetricIds.indexOf(id);
  }

  /**
   * Get metric from given id
   * @param id - id of metric
   * @returns - metric
   */
  getMetric(id: number): Metric {
    return this.initialMetrics.find((m) => {
      return m.id === id;
    });
  }

  /**
   * Populate selected metrics
   */
  selectMetrics(): void {
    this.selectedMetricIds = [];

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
            this.selectedMetricIds.push(threshold.metricId);
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
      if (this.selectedMetricIds.length < this.expectedMetrics) {
        this.initialMetrics.forEach((metric: Metric, _index) => {
          if (
            this.selectedMetricIds.indexOf(metric.id) < 0 &&
            this.availableDimensions.length > 0
          ) {
            this.thresholds.push({
              metricId: metric.id,
              min: metric.minVal,
              max: metric.maxVal,
              dimension: this.availableDimensions[0],
            });
            this.selectedMetricIds.push(metric.id);
            this.availableDimensions.splice(0, 1);
          }
        });
      }
    } else {
      // for widgets with no dimensions, show all as selected;
      this.selectedMetricIds = this.initialMetrics.map((metric) => metric.id);
    }

    this.metricsSelected();
  }

  // get new data and save metrics when changed
  metricsSelected(): void {
    let selected = [];
    if (this.initialMetrics && this.expectedMetrics) {
      while (this.selectedMetricIds.length < this.expectedMetrics) {
        this.selectedMetricIds.push(this.initialMetrics[0].id);
      }
      const diff = this.expectedMetrics - this.selectedMetricIds.length;
      //if not enough metrics, populate with 1st one to prevent breaking
      this.selectedMetricIds.fill(
        this.initialMetrics[0].id,
        this.selectedMetricIds.length - 1,
        diff + this.selectedMetricIds.length - 1
      );
    }

    // add all selected metrics
    if (
      this.selectedMetricIds.length >= this.expectedMetrics ||
      (!this.dimensions && this.selectedMetricIds.length > 0)
    ) {
      // this.selectedMetricIdsMetrics = this.initialMetrics.filter(
      //   (metric) => this.selectedMetricIds.indexOf(metric.id) > -1
      // );

      selected = this.selectedMetricIds.map((metricId) => {
        return this.initialMetrics.find((m) => m.id === metricId);
      });
      this.metricsChanged = false;
    }
    //order is getting reset by this
    // get new data
    this.metricsChange.emit(selected);
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
            const index = this.selectedMetricIds.indexOf(t.metricId);
            this.selectedMetricIds[index] = threshold.metricId;
          }
        });
      } else if (this.dimensions) {
        // put in correct spot
        threshold.dimension = this.availableDimensions[0];
        this.availableDimensions.splice(0, 1);

        this.dimensions.forEach((dim, i) => {
          if (dim === threshold.dimension) {
            this.selectedMetricIds[i] = threshold.metricId;
          }
        });
      } else {
        //put in first available spot
        let metricSet = false;

        this.selectedMetricIds = this.selectedMetricIds.map((s) => {
          if (s || metricSet) {
            return s;
          } else if (!metricSet && !s) {
            metricSet = true;
            return metric.id;
          }
        });
        if (!metricSet) {
          this.selectedMetricIds.push(metric.id);
        }
      }
    } else {
      // already selected, remove dimension
      if (this.dimensions) {
        const dim = threshold.dimension;
        threshold.dimension = null;
        this.availableDimensions.push(dim);
        this.selectedMetricIds[selectedIndex] = null;
      } else if (!this.dimensions) {
        this.selectedMetricIds.splice(selectedIndex, 1);
      }
    }

    this.metricsChanged =
      this.selectedMetricIds.length > 0 &&
      this.availableDimensions.length === 0;
  }
}
