import { Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { Threshold } from '../../../models/threshold';
import {ColumnMode, id} from '@swimlane/ngx-datatable';
import { Metric } from '@core/models/metric';
import { WidgetEditService } from '../../../services/widget-edit.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-threshold-edit',
  templateUrl: './threshold-edit.component.html',
  styleUrls: ['./threshold-edit.component.scss']
})
export class ThresholdEditComponent implements OnInit, OnDestroy {

  constructor(
    private widgetEditService: WidgetEditService
  ) {

  }
  thresholds: {[metricId: number]: Threshold};
  metrics: Metric[];
  editing = {};
  rows = [];

  ColumnMode = ColumnMode;
  subscriptions: Subscription = new Subscription();
  messages = {
      // Message to show when array is presented
  // but contains no values
    emptyMessage: 'Please select metrics.',
  };

  lastEditedCell;

  ngOnInit() {
    const sub = this.widgetEditService.selectedMetrics.subscribe(
      metrics => {
        this.metrics = metrics;
        this.thresholds = this.widgetEditService.getThresholds();
        // console.log(this.thresholds);
        if (!this.thresholds) {
          this.thresholds = {};
        }

        this.rows = [];

        if (this.metrics && this.metrics.length > 0) {
          const newRows = [];
          this.metrics.forEach(
            (metric) => {
              const minVal = metric.minVal || metric.minVal === 0? +metric.minVal : null;
              const maxVal = metric.maxVal || metric.maxVal === 0? +metric.maxVal : null;
              
              if (this.thresholds[metric.id]) {
                const setMin = this.thresholds[metric.id].min;
                const setMax = this.thresholds[metric.id].max;
                newRows.push({
                  id : +this.thresholds[metric.id].id,
                  metric,
                  min: setMin || setMin === 0 ? +setMin : null,
                  max: setMax || setMax === 0 ? +setMax : null,
                  defaultMin: minVal,
                  defaultMax: maxVal
                });
              } else {
                console.log("no thresholds")
                newRows.push({
                  id : null,
                  metric,
                  min: null,
                  max: null,
                  defaultMin: minVal,
                  defaultMax: maxVal
                });
              }

            }
          );
          this.rows = [...newRows];
        }
      }, error => {
        console.log('error in threshold edit: ' + error);
      }
    );
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  showEdit(rowIndex, cell) {
    if (this.lastEditedCell) {
      this.editing[this.lastEditedCell] = false;
    }
    this.lastEditedCell = rowIndex + '-' + cell;
    this.editing[this.lastEditedCell] = true;
  }

  clearThreshold(rowIndex) {
    this.rows[rowIndex].min = null;
    this.rows[rowIndex].max = null;
    this.updateThresholds();
  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    if (cell === 'metricId') {
      this.rows[rowIndex].name = this.getMetric(event.target.value);
    }
    console.log('UPDATED!', this.rows[rowIndex][cell]);
    this.updateThresholds();
  }

  updateThresholds() {
    console.log(this.rows)
    this.rows = [...this.rows];
    this.widgetEditService.updateThresholds(this.rows);
  }

  getMetric(metricId: number) {
    return this.metrics.filter(metric => {
      return metric.id === +metricId;
    })[0].name;
  }

}
