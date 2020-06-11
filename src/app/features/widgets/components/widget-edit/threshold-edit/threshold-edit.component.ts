import { Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { Threshold } from '../../../models/threshold';
import {ColumnMode, id} from '@swimlane/ngx-datatable';
import { Metric } from 'src/app/core/models/metric';
import { WidgetEditService } from '../widget-edit.service';
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
    const sub = this.widgetEditService.metrics.subscribe(
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
              if (this.thresholds[metric.id]) {
                newRows.push({
                  id : +this.thresholds[metric.id].id,
                  metric,
                  min: +this.thresholds[metric.id].min,
                  max: +this.thresholds[metric.id].max,
                  defaultMin: metric.minVal ? metric.minVal : null,
                  defaultMax: metric.maxVal ? metric.maxVal : null
                });
              } else {
                newRows.push({
                  id : null,
                  metric,
                  min: null,
                  max: null,
                  defaultMin: metric.minVal ? metric.minVal : null,
                  defaultMax: metric.maxVal ? metric.maxVal : null
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
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    if (cell === 'metricId') {
      this.rows[rowIndex].name = this.getMetric(event.target.value);
    }
    console.log('UPDATED!', this.rows[rowIndex][cell]);
    this.updateThresholds();
  }

  updateThresholds() {
    this.rows = [...this.rows];
    this.widgetEditService.updateThresholds(this.rows);
  }

  getMetric(metricId: number) {
    return this.metrics.filter(metric => {
      return metric.id === +metricId;
    })[0].name;
  }

}
